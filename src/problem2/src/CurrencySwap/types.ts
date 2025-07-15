export interface SwapState {
  fromSymbol: string;
  toSymbol: string;
  amount: string;
  slippage: string;
  loading: boolean;
  result: number | null;
  executionTime: number | null;
  error: string | null;
}
