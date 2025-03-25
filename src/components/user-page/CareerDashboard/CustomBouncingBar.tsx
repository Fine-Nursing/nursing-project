// components/CareerDashboard/CustomBouncingBar.tsx
import React from 'react';
import type { BarProps } from 'recharts';

interface CustomBouncingBarProps extends BarProps {
  payload?: any;
}

export default function CustomBouncingBar(props: CustomBouncingBarProps) {
  const { x, y, width, height, fill, payload } = props;

  // 바 높이가 0 이하인 경우 렌더 안 함
  if (!height || height <= 0) return null;

  const isUser = payload?.isUser === true;

  // TypeScript 에러를 방지하기 위해 숫자 값을 보장
  const xValue = typeof x === 'number' ? x : 0;
  const yValue = typeof y === 'number' ? y : 0;
  const widthValue = typeof width === 'number' ? width : 0;
  const heightValue = typeof height === 'number' ? height : 0;

  const barRadius = 4;
  return (
    <g>
      {/* 기본 바 */}
      <rect
        x={xValue}
        y={yValue}
        width={widthValue}
        height={heightValue}
        fill={isUser ? '#0d9488' : fill}
        rx={barRadius}
        ry={barRadius}
      />
      {/* isUser일 경우 바 위에 튀는 원(circle) */}
      {isUser && (
        <circle
          cx={xValue + widthValue / 2}
          cy={yValue - 8}
          r="8"
          fill="#0d9488"
          className="animate-bounce"
        />
      )}
    </g>
  );
}
