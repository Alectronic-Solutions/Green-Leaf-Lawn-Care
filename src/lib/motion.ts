// The site's single motion vocabulary, mirrored by the --ease-soft and
// --dur-* CSS variables in globals.css. Use these instead of one-off
// durations or easings so every animation moves the same way.

export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  micro: 0.18,
  ui: 0.42,
  reveal: 0.8,
} as const;

