import React, { useEffect } from 'react';
import { Message } from './Toast.styles.js';

export default function Toast({ message, onDone }) {
  useEffect(() => { if (!message) return undefined; const timer = window.setTimeout(onDone, 2800); return () => window.clearTimeout(timer); }, [message, onDone]);
  return message ? <Message role="status">{message}</Message> : null;
}
