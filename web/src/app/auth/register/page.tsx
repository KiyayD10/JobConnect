"use client";

import Link from 'next/link';
import React from 'react'

function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold">MyApp</h1>

        <Link
          href="/auth/login"
          className="text-sm underline hover:text-blue-600 transition"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}

export default function RegisterPage() {
  return (
    <div>
      <h1>Register Page</h1>
    </div>
  );
}