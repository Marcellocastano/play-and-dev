import type { CSSProperties } from 'react';

const paths = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  back: 'M19 12H5 M11 6l-6 6 6 6',
  book: 'M12 5v16 M12 5C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-2-1-6-2-10 1Z',
  chart: 'M4 4v16h16 M8 15v-4 M13 15V6 M18 15v-7',
  bolt: 'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',
  target: 'M21 12a9 9 0 1 1-9-9 M16 3h5v5 M21 3l-9 9 M16 12a4 4 0 1 1-4-4',
  check: 'M5 12l4 4L19 6',
  close: 'M6 6l12 12 M6 18 18 6',
  chevron: 'm8 4 8 8-8 8',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  code: 'm8 5-6 7 6 7 M16 5l6 7-6 7 M14 3l-4 18',
  clock: 'M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  trophy:
    'M7 3h10v6a5 5 0 0 1-10 0V3Z M7 5H3v3a4 4 0 0 0 4 4 M17 5h4v3a4 4 0 0 1-4 4 M12 14v6 M7 21h10',
  layers: 'm12 3 10 5-10 5L2 8l10-5Z M2 12l10 5 10-5 M2 16l10 5 10-5',
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  className = '',
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
