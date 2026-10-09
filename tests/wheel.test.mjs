import test from 'node:test';
import assert from 'node:assert/strict';
import { parseOptions, validationMessage, randomIndex, landingRotation } from '../wheel.mjs';
test('input validation, whitespace and duplicates', () => {
  assert.deepEqual(parseOptions(' 甲 \r\n\n甲\n 乙 '), ['甲','甲','乙']);
  for (const n of [0,1,51]) assert.ok(validationMessage(Array(n).fill('选项')));
  for (const n of [2,50]) assert.equal(validationMessage(Array(n).fill('选项')), '');
});
test('pointer lands inside selected sector for every supported count and repeated rotations', () => {
  for (let n=2;n<=50;n++) for (let i=0;i<n;i++) for (const current of [0,17,359,3600.3]) {
    const rotation = landingRotation(current,i,n);
    const underPointer = (360 - rotation % 360) % 360;
    assert.equal(Math.floor(underPointer/(360/n)),i);
    assert.ok(rotation-current>=1800);
  }
});
test('random selection rejects biased tail and allows every index', () => {
  for (let n=2;n<=50;n++) for (let i=0;i<n;i++) assert.equal(randomIndex(n,a=>a[0]=i),i);
  let calls=0;
  assert.equal(randomIndex(3,a=>a[0]=calls++===0?0xffffffff:5),2);
  assert.equal(calls,2);
  assert.throws(()=>randomIndex(1),RangeError);
});
