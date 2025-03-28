import { PurchaseModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please fill all required fields!',
                },
                {
                    status: 400,
                }
            );
        }

        const newData = new PurchaseModel(data);

        await newData.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Purchase added successfully!',
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to the database',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
