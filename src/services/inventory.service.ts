import path from 'path';
import { fileURLToPath } from 'url';
import { TRANSACION_TYPES } from '../common/constants.js';

import { Stock } from '../types/stock.js';
import { Transaction } from '../types/transaction.js';
import { readJsonFile } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function getCountForTransactionType(
  transactionType: string,
  skuTransactions: Transaction[],
) {
  return skuTransactions
    .filter((t) => t.type === transactionType)
    .reduce((totalRefund, transaction) => {
      totalRefund += transaction.qty;

      return totalRefund;
    }, 0);
}

function hasSkuInStocks(sku: string, stocks: Stock[]): boolean{
  return stocks.some((s) => s.sku === sku);
}

function hasSkuInTransactions(sku: string, transactions: Transaction[]): boolean{
  return transactions.some((s) => s.sku === sku)
}

function getSkuOrderHistory(
  sku: string,
  transactions: Transaction[],
): {sold: number, refund: number} {
  const skuTransactions = transactions.filter(t => t.sku === sku);

  const sold = getCountForTransactionType(
    TRANSACION_TYPES.SOLD,
    skuTransactions,
  );
  
  const refund = getCountForTransactionType(
    TRANSACION_TYPES.REFUND, skuTransactions,
  );

  return {sold, refund};
}

export async function getCurrentStockFor(sku: string){
  const stocks = await readJsonFile<Array<Stock>>(
    path.join(__dirname, '../data/stock.json'),
  );

  const transactions = await readJsonFile<Array<Transaction>>(
    path.join(__dirname, '../data/transactions.json'),
  );

   const stockExist = hasSkuInStocks(sku, stocks);
   const transactionsExist = hasSkuInTransactions(sku, transactions);

   const skuNotFound = !stockExist && !transactionsExist;

  if (skuNotFound) {
    throw new Error('inavlid sku');
  }

  const {sold, refund} = getSkuOrderHistory(sku, transactions);

  if (!hasSkuInStocks) {
    return {sku, qty: sold - refund};
  }

  const {stock} = stocks.find(s => s.sku === sku);

  return {sku, qty: (stock + refund) - sold};
}
