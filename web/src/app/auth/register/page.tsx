"use client";

import Link from 'next/link';
import React from 'react'
import z from 'zod';

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

const registerSchema = z
  .object({
    name: z.string().min(3, { message: "Minimal 3 karakter" }),
    email: z.string().email({ message: "Masukkan email yang valid" }),
    password: z.string().min(6, { message: "Minimal 6 karakter" }),
    confirmPassword: z.string().min(6, { message: "Minimal 6 karakter" }),
    terms: z.boolean().refine((v) => v === true, {
      message: "Anda harus menyetujui ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  return (
    <div>
      <h1>Register Page</h1>
    </div>
  );
}