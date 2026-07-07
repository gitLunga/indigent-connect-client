import React from 'react';

export function SkeletonShimmerStyle() {
    return (
        <style>{`
            @keyframes skshimmer {
                0%   { background-position: -600px 0; }
                100% { background-position:  600px 0; }
            }
            .sk {
                background: linear-gradient(90deg, #E2E8F2 25%, #EEF2F8 50%, #E2E8F2 75%);
                background-size: 1200px 100%;
                animation: skshimmer 1.5s ease-in-out infinite;
            }
        `}</style>
    );
}

export function Sk({ w, h, r = 6, style = {} }) {
    return (
        <div
            className="sk"
            style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
        />
    );
}
