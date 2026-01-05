'use client';

import { useEffect } from 'react';

export default function PrivacyPage() {
  useEffect(() => {
    window.location.href = 'https://shaba.dev/privacy';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <p>Redirecting to shaba.dev/privacy...</p>
    </div>
  );
}
