'use client';

import { signOut } from 'next-auth/react';

export default async function handleLogout(): Promise<void> {
    await signOut();
}
