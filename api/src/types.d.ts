export interface Session {
  exp: number;
  sessionid: string;
  sub: string;
}

export interface Transaction {
  name: string;
  date: string;
  amount: number;
  checked?: boolean;
  accountid?: string;
}

export interface Account {
  name: string;
  id: string;
  order: number;
  type: string;
  transactions: Transaction[];
  balance?: number;
  exported?: Transaction[];
}

interface ExportTransactions {
  done: Transaction[];
  pending: Transaction[];
}

export interface Export {
  name: string;
  id: string;
  balance: number;
  transactions: ExportTransactions;
}
