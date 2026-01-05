'use client';

import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    window.location.href = 'https://shaba.dev';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <p>Redirecting to shaba.dev...</p>
    </div>
  );
}
