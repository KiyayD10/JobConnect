"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
export default function EditJobPage() {
    const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  return (
    <div>

    </div>
  )
}
