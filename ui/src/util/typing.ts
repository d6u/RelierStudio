/**
 * This will convert:
 *
 * { a: string; } | { b: string; }
 *
 * to:
 *
 * { a: string; } & { b: string;
 */
export type UnionToIntersection<U> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never;
