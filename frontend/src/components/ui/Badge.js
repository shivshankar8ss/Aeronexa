import React from 'react';

export default function Badge({ children, style = {}, className = '' }) {
  return (
    <span
      className={`badge border text-xs font-semibold ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
