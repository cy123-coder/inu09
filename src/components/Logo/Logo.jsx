import React from 'react';
import { Mark } from './Logo.styles.js';

export default function Logo({ large = false }) {
  return <Mark $large={large} aria-label="09INU"><b>09</b><u>INU</u></Mark>;
}
