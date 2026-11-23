import React from 'react';
import { Track } from './Gauge.styles.js';

export default function Gauge({ current = 0, total = 1 }) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return <Track role="progressbar" aria-label="공구 모집 진행률" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} $progress={progress} $full={current >= total}><span /></Track>;
}
