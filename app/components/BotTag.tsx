import React from 'react';

export default function BotTag() {
    return (
        <svg
            width="52"
            height="21"
            viewBox="0 0 60 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block align-middle ml-1.5 transform translate-y-[-1px] select-none pointer-events-none"
        >
            <rect width="60" height="24" rx="4" fill="#5865F2" />
            <path
                d="M7 12.5L10 15.5L16.5 9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <text
                x="22"
                y="16.5"
                fill="white"
                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                }}
                className="!uppercase"
            >
                APP
            </text>
        </svg>
    );
}
