import React from 'react';

/**
 * Official ABA Bank Vector Logo Component
 */
export default function AbaLogo({ className = "w-10 h-10" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={`shrink-0 select-none shadow-2xs ${className}`}
    >
      {/* ABA Navy Blue background */}
      <rect width="100" height="100" rx="20" fill="#005377" />
      
      {/* Top right red accent tab from official brand identity */}
      <path d="M70 0 H85 V20 H70 Z" fill="#600D1C" />
      <path d="M85 0 H100 V20 H85 Z" fill="#E31837" />
      
      {/* White ABA & BANK Typography */}
      <text 
        x="50" 
        y="59" 
        fill="#ffffff" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontWeight="900" 
        fontSize="35" 
        textAnchor="middle" 
        letterSpacing="1"
      >
        ABA
      </text>
      <text 
        x="50" 
        y="79" 
        fill="#ffffff" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontWeight="800" 
        fontSize="11" 
        textAnchor="middle" 
        letterSpacing="4"
      >
        BANK
      </text>
    </svg>
  );
}
