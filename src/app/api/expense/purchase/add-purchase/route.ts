import dbConfig from '@/lib/dbConfig';
import { PurchaseModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data || !data.price || !data.paymentStatus) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide all required fields!',
                },
                { status: 400 }
            );
        }

        await dbConfig();

        const newPurchase = new PurchaseModel(data);
        await newPurchase.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Purchase added and balance updated successfully!',
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update balance!',
                error,
            },
            { status: 500 }
        );
    }
}
