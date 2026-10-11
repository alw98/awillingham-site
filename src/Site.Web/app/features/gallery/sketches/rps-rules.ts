export const RPS_SIZE = 200;
export const RPS_MAX_LEVEL = 4;

// Independent scalar reference for the GPU's packed-byte transition rules.
export function interact(actor: number, target: number): [number, number] {
  const color = actor & 3, level = actor >>> 2;
  if (!color) return [actor, target];
  if (!target && level > 0) return [actor, ((level - 1) << 2) | color];
  if ((target & 3) === (color + 1) % 3 + 1) {
    return [(Math.min(RPS_MAX_LEVEL, level + 1) << 2) | color, target >>> 2 ? target - 4 : color];
  }
  return [actor, target];
}

export function hash(value: number) {
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
}

/** Test reference: disjoint pairs in shifting 2×2 partitions, with wrapped edges. */
export function stepReference(input: Uint8Array, size: number, generation: number, seed: number) {
  const output = input.slice(), shiftX = generation & 1, shiftY = (generation >>> 1) & 1;
  for (let y = 0; y < size; y += 2) for (let x = 0; x < size; x += 2) {
    const key = hash((Math.imul(y * size + x, 0x9e3779b9) ^ Math.imul(generation, 0x85ebca6b) ^ seed) >>> 0);
    const choice = key & 3, mask = choice < 2 ? choice + 1 : 3;
    for (let local = 0; local < 4; local++) {
      const partner = local ^ mask;
      if (local > partner) continue;
      const index = (p: number) => ((y + (p >>> 1) + shiftY) % size) * size + (x + (p & 1) + shiftX) % size;
      const a = index(local), b = index(partner), roll = hash(key ^ local);
      let first = input[a], second = input[b];
      if (roll & 1) [first, second] = [second, first];
      if (hash(roll ^ 0xa511e9b3) % 9 !== 0) [first, second] = interact(first, second);
      if (hash(roll ^ 0x63d83595) % 9 !== 0) [second, first] = interact(second, first);
      if (roll & 1) [first, second] = [second, first];
      output[a] = first; output[b] = second;
    }
  }
  return output;
}
