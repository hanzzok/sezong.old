import { Token } from '../../api/token';

export function isTokenArray(array: any): array is Token[] {
  return Array.isArray(array) && array.every(it => it instanceof Token);
}
