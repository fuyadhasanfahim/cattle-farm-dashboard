import dbConfig from '@/lib/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendMail } from '@/utils/mailer';
import UserModel from '@/models/user.model';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide all required fields',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const user = await UserModel.findOne({ email });
        if (user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User already exists',
                },
                {
                    status: 400,
                }
            );
        }

        const salt = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        await sendMail({ email, emailType: 'VERIFY', userId: newUser._id });

        return NextResponse.json(
            {
                success: true,
                message: 'User created successfully',
                user: newUser,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message ||
                    'An error occurred while signing up',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
