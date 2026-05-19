export interface VaultRecord {
  id: string;                  // auto-generated uuid
  walletAddress: string;       // vault wallet address
  inscriptionNumber: number;   // ordinal inscription number
  inscriptionId: string;       // long inscription ID string e.g. "01b0dd65...i0"
  assetName: string;           // e.g. "Curry Card #47"
  createdAt: string;           // ISO date string
}
