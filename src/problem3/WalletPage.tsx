import React, { useMemo } from 'react';
import { BoxProps } from '@mui/material';
import WalletRow from './WalletRow';
import useWalletBalances from './hooks/useWalletBalances';
import usePrices from './hooks/usePrices';

// ----------------------
// Types
// ----------------------

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Required for sorting
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Prices {
  [currency: string]: number;
}

interface Props extends BoxProps {}


// ----------------------
// Blockchain Priority Map
// ----------------------

// Replacing the switch-case in your original `getPriority` function
const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return PRIORITY_MAP[blockchain] ?? -99;
};


// ----------------------
// Main Component
// ----------------------

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props): JSX.Element => {
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Prices = usePrices();

  // Filters out invalid balances (unknown blockchain or non-positive amount),
  // then sorts valid entries by descending priority.
  const sortedBalances: WalletBalance[] = useMemo((): WalletBalance[] => {
    return balances
      .filter((balance: WalletBalance): boolean => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a: WalletBalance, b: WalletBalance): number =>
        getPriority(b.blockchain) - getPriority(a.blockchain)
      );
  }, [balances]); // `prices` was incorrectly listed before

  // Cheap formatting, no memo needed
  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    (balance: WalletBalance): FormattedWalletBalance => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    })
  );

  // Render WalletRow components with computed USD values
  const rows: JSX.Element[] = useMemo((): JSX.Element[] => {
    return formattedBalances.map((balance: FormattedWalletBalance): JSX.Element => {
      const usdValue: number = (prices[balance.currency] ?? 0) * balance.amount;

      return (
        <WalletRow
          key={balance.currency} // More stable than index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
