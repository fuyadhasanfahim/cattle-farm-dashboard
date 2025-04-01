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
        await newPurchase.save();

        const lastBalance = await BalanceModel.findOne().sort({
            createdAt: -1,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateFields: any = {};

        if (data.paymentStatus === 'Paid') {
            updateFields.$inc = { expense: data.price };
        } else if (data.paymentStatus === 'Pending') {
            updateFields.$inc = { due: data.dueAmount };
        } else if (data.paymentStatus === 'Partially Paid') {
            updateFields.$inc = {
                expense: data.paymentAmount,
                due: data.dueAmount,
            };
        }

        if (lastBalance) {
            await BalanceModel.findByIdAndUpdate(lastBalance._id, updateFields);
        } else {
            await new BalanceModel({
                balance: 0,
                earnings: 0,
                expenses:
                    data.paymentStatus === 'Paid'
                        ? data.price
                        : data.paymentAmount || 0,
                due: data.paymentStatus === 'Pending' ? data.dueAmount : 0,
            }).save();
        }

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
