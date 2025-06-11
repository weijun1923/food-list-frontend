'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">首頁</h1>
      <button
        onClick={() => router.push('/menu-review')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        查看所有菜單
      </button>
    </main>
  );
}
