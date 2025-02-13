import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';
import UserModel from '@/models/user.model';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials.');
                }

                try {
                    await dbConnect();

                    const user = await UserModel.findOne({
                        email: credentials.email,
                    });

                    if (!user) {
                        throw new Error('No user found with email.');
                    }

                    if (!user.password) {
                        throw new Error('User has no password set.');
                    }

                    const isValid = await compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValid) {
                        throw new Error('Invalid password.');
                    }

                    const userWithoutPassword = {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        username: user.username,
                        phone: user.phone,
                        role: user.role,
                        image: user.profileImage,
                    };

                    return userWithoutPassword;
                } catch (error) {
                    console.log('Auth error:', error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.username = user.username;
                token.phone = user.phone;
                token.profileImage = user.profileImage;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.user.name = token.name as string;
            session.user.username = token.username as string;
            session.user.phone = token.phone as string;
            session.user.profileImage = token.profileImage as string;
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
