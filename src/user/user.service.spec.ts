import { somar } from '../utils/somar';

test('This is my first test', () => {
  const result = somar(3, 2);
  expect(result).toEqual(5);
});
