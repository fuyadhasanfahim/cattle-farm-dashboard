import MilkModel from '@/models/milk.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { বিক্রয়যোগ্য_দুধের_পরিমাণ,
            খাওয়ার_দুধের_পরিমাণ, } = await request.json();

        if (!বিক্রয়যোগ্য_দুধের_পরিমাণ || !খাওয়ার_দুধের_পরিমাণ) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide the required field',
                },
                {
                    status: 400,
                }
            );
        }

        const milk = new MilkModel({
            বিক্রয়যোগ্য_দুধের_পরিমাণ,
            খাওয়ার_দুধের_পরিমাণ,
        });

        await milk.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Milk added successfully',
                data: milk,
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
                    (error as Error).message || 'An unexpected error occurred',
            },
            {
                status: 500,
            }
        );
    }
}
