const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const icons = {
  air: <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" {...s} />,
  ocean: <><path d="M3 15h18l-2 4H5z" {...s} /><path d="M6 15V9h12v6M12 9V5h3" {...s} /></>,
  road: <><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" {...s} /><circle cx="6.5" cy="17.5" r="1.8" {...s} /><circle cx="16.5" cy="17.5" r="1.8" {...s} /></>,
  warehouse: <path d="M3 21V9l9-5 9 5v12M7 21v-7h10v7M7 17.5h10" {...s} />,
  box: <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12 4 7.5" {...s} />,
  bolt: <path d="M13 3 6 13h5l-1 8 8-11h-5z" {...s} />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" {...s} />,
  doc: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" {...s} />,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" {...s} /><circle cx="12" cy="10" r="2.5" {...s} /></>,
  support: <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z" {...s} />,
} as const;

export type IconName = keyof typeof icons;

export const Ic = ({ n }: { n: IconName }) => <svg viewBox="0 0 24 24" aria-hidden="true">{icons[n]}</svg>;
