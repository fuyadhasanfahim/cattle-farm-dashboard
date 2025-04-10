import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { SaleModel } from '@/models/expense.model';
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
                { status: 400 }
            );
        }

        await dbConfig();

        const newData = new SaleModel(data);

        let due = 0;
        let earning = 0;

        if (data.paymentStatus === 'Paid') {
            earning = data.price;
        } else if (data.paymentStatus === 'Pending') {
            due = data.dueAmount;
        } else {
            earning = data.paymentAmount;
            due = data.dueAmount;
        }

        await BalanceModel.create({
            due,
            earning,
            description: data.description,
            date: new Date(),
        });

        await newData.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Sale added successfully!',
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to the database',
                error,
            },
            { status: 500 }
        );
    }
}
