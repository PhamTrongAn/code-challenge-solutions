import type { TokenInfo } from '../constants/tokens.ts';

export function getToken(tokens: TokenInfo[], symbol: string): TokenInfo | undefined {
  return tokens.find((t) => t.symbol === symbol);
}

export function calculateSwap(
  tokens: TokenInfo[],
  fromSymbol: string,
  toSymbol: string,
  amount: number
): number | null {
  const fromToken = getToken(tokens, fromSymbol);
  const toToken = getToken(tokens, toSymbol);
  if (!fromToken || !toToken) return null;
  const usdValue = amount * fromToken.price;
  return usdValue / toToken.price;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
