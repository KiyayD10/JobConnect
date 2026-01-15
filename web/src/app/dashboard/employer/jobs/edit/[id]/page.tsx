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
    // initial state
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "FULL_TIME",
        salary: "",
        description: "",
        requirements: ""
    });
    return (
        <div>

        </div>
    )
}
