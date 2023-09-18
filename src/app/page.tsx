'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Page.module.css';

const Page = () => {
  const { push } = useRouter();

  const handleRedirect = () => {
    push('/TextExample');
  };

  return (
    <div
      className={`${styles.pageContainer} flex h-screen items-center justify-center`}
    >
      <button className='text-4xl text-white' onClick={handleRedirect}>
        Let AI help you...
      </button>
    </div>
  );
};

export default Page;
