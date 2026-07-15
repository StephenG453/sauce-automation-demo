/**
 * Small helpers for generating unique, disposable test data so specs
 * that create accounts can be re-run without colliding on existing records.
 * No real/PII data is ever hard-coded here.
 */
export function uniqueEmail(prefix = 'qa.sample'): string {
  const stamp = Date.now();
  return `${prefix}+${stamp}@example.com`;
}

export function randomPassword(length = 14): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
