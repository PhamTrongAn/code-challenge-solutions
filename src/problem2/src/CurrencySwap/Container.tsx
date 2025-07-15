import { useState } from 'react';
import { TOKENS, type TokenInfo } from '../constants/tokens.ts';
import type { SwapState } from './types.ts';
import { calculateSwap, sleep } from './utils.ts';
import SwapFormView from './FormView.tsx';
import SwapResultView from './ResultView.tsx';
import { Button } from '../components/ui/button.tsx';
import { HelpCircle } from 'lucide-react';

export default function Container() {
  const [tokens] = useState<TokenInfo[]>(TOKENS);
  const [state, setState] = useState<SwapState>({
    fromSymbol: TOKENS[0].symbol,
    toSymbol: TOKENS[1].symbol,
    amount: '',
    slippage: '0.5',
    loading: false,
    result: null,
    executionTime: null,
    error: null,
  });

  const handleSwap = async () => {
    const { fromSymbol, toSymbol, amount } = state;
    const amountNum = parseFloat(amount);

    if (!fromSymbol || !toSymbol) {
      return setState((s) => ({ ...s, error: 'Please select both tokens.' }));
    }
    if (fromSymbol === toSymbol) {
      return setState((s) => ({ ...s, error: 'Cannot swap the same token.' }));
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      return setState((s) => ({ ...s, error: 'Invalid amount.' }));
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    const start = Date.now();
    await sleep(1500);
    const result = calculateSwap(tokens, fromSymbol, toSymbol, amountNum);
    if (result === null) {
      return setState((s) => ({ ...s, loading: false, error: 'Tokens not found.' }));
    }
    const executionTime = (Date.now() - start) / 1000;
    setState((s) => ({ ...s, result, executionTime, loading: false }));
  };

  const handleSwitchTokens = () => {
    setState((s) => ({
      ...s,
      fromSymbol: s.toSymbol,
      toSymbol: s.fromSymbol,
      amount: s.result ? s.result.toFixed(2) : s.amount,
      result: s.amount ? parseFloat(s.amount) : null,
    }));
  };

  const handleChange = (key: keyof SwapState, value: string) => {
    setState((s) => ({ ...s, [key]: value, error: null }));
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.2)] flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 bg-gray-900/50">
            <SwapFormView
              state={state}
              currentTokens={tokens}
              handleSwap={handleSwap}
              handleSwitchTokens={handleSwitchTokens}
              handleChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/2 p-8 bg-gray-800/50 flex flex-col justify-between">
            <SwapResultView state={state} currentTokens={tokens} />
          </div>
        </div>
      </div>
      <Button variant="ghost" className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full w-10 h-10 p-0">
        <HelpCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
