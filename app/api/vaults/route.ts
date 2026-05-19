import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { VaultRecord } from '@/app/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'vaults.json');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'changeme';

async function readVaults(): Promise<VaultRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeVaults(vaults: VaultRecord[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(vaults, null, 2));
}

// GET /api/vaults?address=xxx  or  GET /api/vaults (all)
export async function GET(req: NextRequest) {
  const vaults = await readVaults();
  const address = req.nextUrl.searchParams.get('address');

  if (address) {
    const normalized = address.trim().toLowerCase();
    const found = vaults.filter(
      (v) => v.walletAddress.toLowerCase() === normalized
    );
    return NextResponse.json(found);
  }

  return NextResponse.json(vaults);
}

// POST /api/vaults  (admin only — requires secret header)
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { walletAddress, inscriptionNumber, inscriptionId, assetName } = body;

  if (!walletAddress || !inscriptionNumber || !inscriptionId || !assetName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const vaults = await readVaults();

  const newRecord: VaultRecord = {
    id: crypto.randomUUID(),
    walletAddress: walletAddress.trim(),
    inscriptionNumber: Number(inscriptionNumber),
    inscriptionId: inscriptionId.trim(),
    assetName: assetName.trim(),
    createdAt: new Date().toISOString(),
  };

  vaults.push(newRecord);
  await writeVaults(vaults);

  return NextResponse.json(newRecord, { status: 201 });
}

// DELETE /api/vaults?id=xxx  (admin only)
export async function DELETE(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const vaults = await readVaults();
  const filtered = vaults.filter((v) => v.id !== id);
  await writeVaults(filtered);

  return NextResponse.json({ success: true });
}
