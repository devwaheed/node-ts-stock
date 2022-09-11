import { getCurrentStockFor } from './services/index.js';

const result = await getCurrentStockFor('LTV719449/39/39').catch(console.error);
console.log(result);
