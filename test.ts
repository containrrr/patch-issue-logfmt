
import * as fs from 'fs';
import { patchCodeBlocks } from './block-formatter';

const testSource = fs.readFileSync('test_body.txt', {encoding: 'utf-8'});
const expectedPatched = fs.readFileSync('test_patched.txt', {encoding: 'utf-8'});

test('patches 5 items in example text', () => {
    const [patched, patchCount] = patchCodeBlocks(testSource);
    expect(patchCount).toBe(5);
    expect(patched).toBe(expectedPatched);
});

// const [patched, patchCount] = patchCodeBlocks(testSource); console.log(patched)