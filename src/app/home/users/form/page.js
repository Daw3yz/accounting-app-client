'use client'

import { useRouter } from 'next/navigation'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function CreateUserPage() {

    const router = useRouter()

    router.push("/home/users")
}