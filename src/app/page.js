'use client'
import React from "react"
import { useRouter } from 'next/navigation'


export default function IndexPage() {
    const router = useRouter()

    router.push('/home')
}
