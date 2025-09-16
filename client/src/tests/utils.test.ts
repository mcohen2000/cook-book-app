import { test, expect, } from 'vitest';
import { isAuthor } from '../utils/isAuthor';

test('isAuthor', () => {
  expect(isAuthor('1', '1')).toBe(true);
  expect(isAuthor('1', '2')).toBe(false);
});