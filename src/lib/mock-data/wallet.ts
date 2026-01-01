// Mock data for Wallets (V2 Marketplace)

export type TransactionType = 
  | 'deposit'
  | 'job_payment'
  | 'job_fee'
  | 'earning'
  | 'withdrawal'
  | 'withdrawal_fee'
  | 'refund';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  totalDeposited: number;
  totalSpent: number;
  totalEarned: number;
  totalWithdrawn: number;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: Date;
}

export const mockWallets: Record<string, Wallet> = {
  'user-emp-1': {
    id: 'wallet-emp-1',
    userId: 'user-emp-1',
    balance: 2500,
    pendingBalance: 0,
    totalDeposited: 5000,
    totalSpent: 2500,
    totalEarned: 0,
    totalWithdrawn: 0,
    updatedAt: new Date(),
  },
  'user-emp-2': {
    id: 'wallet-emp-2',
    userId: 'user-emp-2',
    balance: 1200,
    pendingBalance: 0,
    totalDeposited: 3000,
    totalSpent: 1800,
    totalEarned: 0,
    totalWithdrawn: 0,
    updatedAt: new Date(),
  },
  'user-worker-1': {
    id: 'wallet-worker-1',
    userId: 'user-worker-1',
    balance: 1250,
    pendingBalance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    totalEarned: 3450,
    totalWithdrawn: 2200,
    updatedAt: new Date(),
  },
  'user-worker-2': {
    id: 'wallet-worker-2',
    userId: 'user-worker-2',
    balance: 450,
    pendingBalance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    totalEarned: 850,
    totalWithdrawn: 400,
    updatedAt: new Date(),
  },
};

export const mockTransactions: Transaction[] = [
  // Employer 1 transactions
  {
    id: 'txn-1',
    walletId: 'wallet-emp-1',
    userId: 'user-emp-1',
    type: 'deposit',
    amount: 5000,
    balanceBefore: 0,
    balanceAfter: 5000,
    description: 'เติมเงินผ่าน PromptPay',
    createdAt: new Date('2024-01-15T10:00:00'),
  },
  {
    id: 'txn-2',
    walletId: 'wallet-emp-1',
    userId: 'user-emp-1',
    type: 'job_payment',
    amount: -2500,
    balanceBefore: 5000,
    balanceAfter: 2500,
    description: 'จ่ายค่างาน: FB Like 500 likes',
    referenceType: 'job',
    referenceId: 'job-1',
    createdAt: new Date('2024-01-15T11:00:00'),
  },
  
  // Worker 1 transactions
  {
    id: 'txn-3',
    walletId: 'wallet-worker-1',
    userId: 'user-worker-1',
    type: 'earning',
    amount: 25.50,
    balanceBefore: 1224.50,
    balanceAfter: 1250,
    description: 'รายได้จากงาน: FB Like',
    referenceType: 'claim',
    referenceId: 'claim-1',
    createdAt: new Date('2024-01-20T14:30:00'),
  },
  {
    id: 'txn-4',
    walletId: 'wallet-worker-1',
    userId: 'user-worker-1',
    type: 'withdrawal',
    amount: -500,
    balanceBefore: 1750,
    balanceAfter: 1250,
    description: 'ถอนเงินเข้าบัญชี กสิกรไทย',
    createdAt: new Date('2024-01-18T09:00:00'),
  },
];

// Helper functions
export function getWalletByUserId(userId: string): Wallet | undefined {
  return mockWallets[userId];
}

export function getTransactionsByUserId(userId: string): Transaction[] {
  return mockTransactions
    .filter(t => t.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
