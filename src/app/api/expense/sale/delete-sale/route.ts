import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { SaleModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide a valid ID',
                },
                { status: 400 }
            );
        }

        const saleData = await SaleModel.findById(id);

        let due = 0;
        let earning = 0;

        if (saleData.paymentStatus === 'Paid') {
            earning = -saleData.price;
        } else if (saleData.paymentStatus === 'Pending') {
            due = -saleData.dueAmount;
        } else {
            earning = -saleData.paymentAmount;
            due = -saleData.dueAmount;
        }

        await BalanceModel.create({
            due,
            earning,
            description: saleData.description,
            date: new Date(),
        });

        await SaleModel.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: 'Sale deleted successfully!',
            },
            { status: 200 }
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
