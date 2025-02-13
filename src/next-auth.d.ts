import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            username: string;
            phone: string;
            profileImage?: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        role: string;
        username: string;
        phone: string;
        profileImage?: string;
    }
}
