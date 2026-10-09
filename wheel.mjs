export function parseOptions(text) {
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}
export function validationMessage(options) {
  if (!options.length) return '请输入名字或事项，每行一个选项。';
  if (options.length < 2) return '至少需要 2 个选项才能抽签。';
  if (options.length > 50) return '最多支持 50 个选项，请减少后再试。';
  return '';
}
// Rejection sampling avoids the modulo bias of mapping a uint32 directly.
export function randomIndex(count, random = array => crypto.getRandomValues(array)) {
  if (!Number.isInteger(count) || count < 2 || count > 50) throw new RangeError('Invalid option count');
  const array = new Uint32Array(1);
  const limit = Math.floor(2 ** 32 / count) * count;
  do { random(array); } while (array[0] >= limit);
  return array[0] % count;
}
export function landingRotation(current, index, count) {
  const target = (360 - (index + 0.5) * 360 / count) % 360;
  return current + 5 * 360 + ((target - current % 360 + 360) % 360);
}
