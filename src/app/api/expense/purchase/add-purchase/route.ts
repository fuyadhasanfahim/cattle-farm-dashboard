import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
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

        let balance = 0;
        let due = 0;
        const earning = 0;
        let expense = 0;

        if (data.paymentStatus === 'Paid') {
            balance = -data.price;
            expense = data.price;
        } else if (data.paymentStatus === 'Pending') {
            due = data.dueAmount;
        } else {
            balance = -data.paymentAmount;
            expense = data.paymentAmount;
            due = data.dueAmount;
        }

        await BalanceModel.create({
            balance,
            due,
            expense,
            earning,
            description: data.description,
            date: new Date(),
        });

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
