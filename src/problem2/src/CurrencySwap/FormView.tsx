import { Input } from '../components/ui/input.tsx';
import { Button } from '../components/ui/button.tsx';
import { Label } from '../components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.tsx';
import { RefreshCw, ChevronDown, Rocket } from 'lucide-react';
import type { TokenInfo } from '../constants/tokens.ts';
import type { SwapState } from './types.ts';

interface SwapFormViewProps {
  state: SwapState;
  currentTokens: TokenInfo[];
  handleSwap: () => void;
  handleSwitchTokens: () => void;
  handleChange: (key: keyof SwapState, value: string) => void;
}

export default function SwapFormView({
  state,
  currentTokens,
  handleSwap,
  handleSwitchTokens,
  handleChange,
}: SwapFormViewProps) {
  const { fromSymbol, toSymbol, amount, slippage, loading, result, error } = state;
  const fromToken = currentTokens.find((t) => t.symbol === fromSymbol);
  const toToken = currentTokens.find((t) => t.symbol === toSymbol);
  const exchangeRate = fromToken && toToken ? (fromToken.price / toToken.price).toFixed(1) : '0';

  const renderTokenSelect = (
    label: string,
    value: string,
    onChange: (val: string) => void,
  ) => (
    <div className="space-y-1">
      <Label className="text-sm text-gray-300">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-10 bg-gray-800 text-white border border-gray-600 rounded-md hover:border-cyan-400">
          <SelectValue placeholder={`Select ${label.toLowerCase()} token`} />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 text-white border border-gray-700 max-h-72 overflow-y-auto z-50">
          {currentTokens.map((token) => (
            <SelectItem key={token.symbol} value={token.symbol} className="hover:bg-cyan-800/30">
              <div className="flex items-center gap-2">
                <img src={token.icon} alt={token.symbol} className="w-5 h-5" />
                <span>{token.symbol}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Swap Tokens</h2>
        <RefreshCw className="w-5 h-5 text-cyan-400 cursor-pointer hover:rotate-180 transition-transform" />
      </div>
      <div className="space-y-4">
        {renderTokenSelect('From', fromSymbol, (val) => handleChange('fromSymbol', val))}
        <Input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('amount', e.target.value)}
          placeholder="0.00"
          className="bg-gray-800 text-white border border-gray-600 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="flex justify-center">
          <Button variant="ghost" onClick={handleSwitchTokens} className="p-2 rounded-full hover:bg-cyan-500/20">
            <ChevronDown className="w-6 h-6 text-cyan-400" />
          </Button>
        </div>
        {renderTokenSelect('To', toSymbol, (val) => handleChange('toSymbol', val))}
        <Input
          type="number"
          inputMode="decimal"
          value={result?.toFixed(2) || '0.00'}
          disabled
          className="bg-gray-800 text-white border border-gray-600 rounded-md cursor-not-allowed"
        />
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Exchange Rate</span>
            <span>
              1 {fromSymbol} = {exchangeRate} {toSymbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee</span>
            <span>0.005 ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Slippage</span>
            <span>{slippage}%</span>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <Button
          disabled={loading || !amount}
          onClick={handleSwap}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-black font-semibold flex items-center justify-center gap-2"
        >
          <Rocket className="w-4 h-4" />
          {loading ? 'Executing...' : 'Execute Swap'}
        </Button>
      </div>
    </div>
  );
}
