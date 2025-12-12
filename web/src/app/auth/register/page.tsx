"use client";

import Link from 'next/link';
import React from 'react'
import z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/lib/utils";


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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterSchema) {
    console.log("register", data);
    await new Promise((r) => setTimeout(r, 800));
  }

   return (
    <>
      {/* Header */}
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
              <CardDescription>
                Buat akun untuk mulai menggunakan layanan
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* NAME */}
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    {...register("name")}
                    className={cn(errors.name && "border-destructive mt-1")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Masukkan email"
                    {...register("email")}
                    className={cn(errors.email && "border-destructive mt-1")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <Label htmlFor="password">Kata Sandi</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan kata sandi"
                    {...register("password")}
                    className={cn(errors.password && "border-destructive mt-1")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi kata sandi"
                    {...register("confirmPassword")}
                    className={cn(
                      errors.confirmPassword && "border-destructive mt-1"
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* TERMS */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" {...register("terms")} />
                  <Label htmlFor="terms" className="text-sm select-none">
                    Saya menyetujui Syarat & Ketentuan
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.terms.message}
                  </p>
                )}

                {/* BUTTON */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sedang membuat akun..." : "Daftar"}
                </Button>

                <Separator />

                <div className="text-center text-sm">
                  Sudah punya akun?{" "}
                  <Link href="/auth/login" className="underline ml-1">
                    Masuk
                  </Link>
                </div>
              </form>
            </CardContent>

            <CardFooter className="text-center text-xs text-muted-foreground">
              Dengan mendaftar, Anda setuju dengan kebijakan kami.
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
