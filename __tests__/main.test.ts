import { getCurrentStockFor } from '../src/services/index.js';

test('LTV719449/39/39 should be 8510', () => {
  expect(getCurrentStockFor('LTV719449/39/39')).toBe(8510);
});


test('LTV719449/39/3 should be 8510', () => {
  expect(getCurrentStockFor('LTV719449/39/3')).toThrowError('inavlid sku');
});
