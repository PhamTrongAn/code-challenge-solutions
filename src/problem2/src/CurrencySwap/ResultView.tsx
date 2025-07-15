import { Maximize2 } from 'lucide-react';
import type { TokenInfo } from '../constants/tokens.ts';
import type { SwapState } from './types.ts';

interface SwapResultViewProps {
  state: SwapState;
  currentTokens: TokenInfo[];
}

export default function SwapResultView({ state, currentTokens }: SwapResultViewProps) {
  const { fromSymbol, toSymbol, amount, result, executionTime } = state;
  const fromToken = currentTokens.find((t) => t.symbol === fromSymbol);
  const toToken = currentTokens.find((t) => t.symbol === toSymbol);
  const fakeHash = '0x7fba...92b3';
  const fakeGasUsed = '21,000';
  const fakeGasPrice = '25 gwei';
  const fakeBlock = '18,456,789';
  const fakePriceImpact = 0.1;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Swap Result</h2>
        <div className="cursor-pointer">
          <Maximize2 className="w-5 h-5 text-gray-400 hover:text-white" />
        </div>
      </div>
      {result !== null && fromToken && toToken && executionTime ? (
        <div className="space-y-6">
          <div className="bg-green-700/50 rounded-md p-2 text-center text-green-300 font-semibold">
            Transaction Successful
          </div>
          <p className="text-sm text-gray-300 text-center">Completed in {executionTime.toFixed(1)} seconds</p>
          <div className="space-y-2 text-lg">
            <div className="flex justify-between">
              <span>You Paid</span>
              <span className="text-red-400">- {parseFloat(amount).toFixed(1)} {fromSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span>You Received</span>
              <span className="text-green-400">+ {result.toFixed(1)} {toSymbol}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-300">
            <p className="text-cyan-400 font-semibold">Transaction Details</p>
            <div className="flex justify-between">
              <span>Hash</span>
              <span>{fakeHash}</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Used</span>
              <span>{fakeGasUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Price</span>
              <span>{fakeGasPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Block</span>
              <span>{fakeBlock}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-cyan-400 font-semibold">Price Impact</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${fakePriceImpact}%` }} />
              </div>
              <span className="text-sm text-gray-300">{fakePriceImpact}%</span>
            </div>
            <p className="text-green-400 text-sm">Low Impact - Good trade</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center flex-grow flex items-center justify-center">Awaiting swap execution</p>
      )}
    </div>
  );
}
