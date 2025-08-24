// Simple smoke test for the test environment
describe('Frontend Test Environment', () => {
  test('test environment is working', () => {
    expect(1 + 1).toBe(2);
  });

  test('React is available', () => {
    const React = require('react');
    expect(React).toBeDefined();
  });

  test('can import and use basic functions', () => {
    const sum = (a, b) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
