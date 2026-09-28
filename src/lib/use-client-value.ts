import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Reads a browser-only value (URL params, storage, today's date) without a
 * hydration mismatch: the static HTML renders `serverValue`, then React
 * swaps in the real value right after hydration. `read` must return a
 * primitive so repeat calls compare equal.
 */
export function useClientValue<T extends string | number | boolean | null>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribe, read, () => serverValue);
}
