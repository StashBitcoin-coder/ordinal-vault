export interface VaultRecord {
  id: string;                  // auto-generated uuid
  walletAddress: string;       // vault wallet address
  inscriptionNumber: number;   // ordinal inscription number
  inscriptionId: string;       // long inscription ID string e.g. "01b0dd65...i0"
  assetName: string;           // e.g. "RWA#001"
  createdAt: string;           // ISO date string
  edition?: string;            // e.g. "2/5" — edition within a series
  title?: string;              // artwork title e.g. "Sun Shooter"
}
