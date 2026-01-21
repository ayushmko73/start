import React from 'react';

interface PieceProps {
  color: 'w' | 'b';
  className?: string;
}

export const Pawn = ({ color, className = '' }: PieceProps) => (
  <svg viewBox="0 0 45 45" className={className} fill={color === 'w' ? '#fff' : '#000'} stroke={color === 'w' ? '#000' : '#fff'} strokeWidth="1.5">
    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
  </svg>
);

export const Rook = ({ color, className = '' }: PieceProps) => (
  <svg viewBox="0 0 45 45" className={className} fill={color === 'w' ? '#fff' : '#000'} stroke={color === 'w' ? '#000' : '#fff'} strokeWidth="1.5">
    <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="round" />
    <path d="M34 14l-3 3H14l-3-3" />
    <path d="M31 17v12.5c0 2.76-2.24 5-5 5h-7c-2.76 0-5-2.24-5-5V17" />
    <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
    <path d="M11 14h23" strokeLinecap="round" />
  </svg>
);

export const Knight = ({ color, className = '' }: PieceProps) => (
  <svg viewBox="0 0 45 45" className={className} fill={color === 'w' ? '#fff' : '#000'} stroke={color === 'w' ? '#000' : '#fff'} strokeWidth="1.5">
    <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
    <path d="M24 18c.38 2.32-4.68 1.97-5 0" />
    <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 1 2.5-2.5-1.5-2.5 2-2.5 2-2.5-1.5-1.5 2.5-2.5 2.5-2.5-2-1.5-2.5-3-2.5-3s2-2 2.5-3.5c-3-2-6-1.5-6-1.5s-2-2.5-5-2.5c-2 0-3 2.5-3 2.5s3 1.5 2.5 3.5c-.5 2 1 3 1 3" />
  </svg>
);

export const Bishop = ({ color, className = '' }: PieceProps) => (
  <svg viewBox="0 0 45 45" className={className} fill={color === 'w' ? '#fff' : '#000'} stroke={color === 'w' ? '#000' : '#fff'} strokeWidth="1.5">
    <g fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45" fill={color === 'w' ? '#fff' : '#000'} />
      <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill={color === 'w' ? '#fff' : '#000'} />
      <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill={color === 'w' ? '#fff' : '#000'} />
    </g>
    <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinecap="round" />
  </svg>
);

export const Queen = ({ color, className = '' }: PieceProps) => (
  <svg viewBox="0 0 45 45" className={className} fill={color === 'w' ? '#fff' : '#000'} stroke={color === 'w' ? '#000' : '#fff'} strokeWidth="1.5">
    <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 19.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 19.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
    <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-5.5-13.5V25l-7-11-2 12z" fill={color === 'w' ? '#fff' : '#000'} strokeLinecap="round" />
    <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 1 2.5-2.5-1.5-2.5 2-2.5 2-2.5-1.5-1.5 2.5-2.5 2.5-2.5-2-1.5-2.5-3-2.5-3s2-2 2.5-3.5c-3-2-6-1.5-6-1.5s-2-2.5-5-2.5c-2 0-3 2.5-3 2.5s3 1.5 2.5 3.5c-.5 2 1 3 1 3" fill="none" stroke="none" />
    <path d="M11 38.5a35 35 0 1 0 23 0" fill="none" strokeLinecap="round" />
    <path d="M11 29a35 35 0 0 1 23 0M12.5 31.5h20M11.5 34h22M10.5 37.5h24" strokeLinecap="round" />
  </svg>
);

export const King = ({ color, className = '' }: PieceProps) => (
  <svg viewBox="0 0 45 45" className={className} fill={color === 'w' ? '#fff' : '#000'} stroke={color === 'w' ? '#000' : '#fff'} strokeWidth="1.5">
    <path d="M22.5 11.63V6M20 8h5" strokeLinecap="round" />
    <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={color === 'w' ? '#fff' : '#000'} />
    <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-2.5-5-2.5-1.5 0-3 2-1.5 2-3 2-2 0-3-2-1.5-2-3-2-3 .5-5 2.5-4 3-8 2c-3 6 6 10.5 6 10.5v7z" fill={color === 'w' ? '#fff' : '#000'} />
    <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0" strokeLinecap="round" />
  </svg>
);