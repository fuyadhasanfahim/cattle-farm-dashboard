import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await dbConfig();

        const data = await CattleModel.find({
            মোটাতাজা_করন_স্ট্যাটাস: 'এক্টিভ',
        }).sort('-createdAt');

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No active fattening data found!',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved the active fattening data.',
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Something went wrong!',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
