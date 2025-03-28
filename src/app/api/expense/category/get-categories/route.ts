export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import { CategoryModel } from '@/models/expense.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await CategoryModel.find();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No expenses found.',
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved categories',
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
