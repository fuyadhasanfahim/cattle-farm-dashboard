import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { SaleModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');
        const data = await request.json();

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide a valid ID',
                },
                { status: 400 }
            );
        }

        const oldSale = await SaleModel.findById(id);

        if (!oldSale) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No data found',
                },
                { status: 404 }
            );
        }

        const oldPaymentAmount = oldSale.paymentAmount ?? 0;
        const oldDueAmount = oldSale.dueAmount ?? 0;
        const oldStatus = oldSale.paymentStatus;

        const newPaymentAmount = data.paymentAmount ?? 0;
        const newDueAmount = data.dueAmount ?? 0;
        const newStatus = data.paymentStatus;

        let earningDiff = 0;
        let dueDiff = 0;

        if (
            oldStatus !== newStatus ||
            oldPaymentAmount !== newPaymentAmount ||
            oldDueAmount !== newDueAmount
        ) {
            if (oldStatus === 'Paid') {
                earningDiff -= oldPaymentAmount;
            } else if (oldStatus === 'Pending') {
                dueDiff -= oldDueAmount;
            } else if (oldStatus === 'Partial') {
                earningDiff -= oldPaymentAmount;
                dueDiff -= oldDueAmount;
            }

            if (newStatus === 'Paid') {
                earningDiff += newPaymentAmount;
            } else if (newStatus === 'Pending') {
                dueDiff += newDueAmount;
            } else if (newStatus === 'Partial') {
                earningDiff += newPaymentAmount;
                dueDiff += newDueAmount;
            }

            await BalanceModel.findOneAndUpdate(
                {},
                {
                    $inc: {
                        earning: earningDiff,
                        due: dueDiff,
                    },
                },
                { new: true }
            );
        }

        const updatedSale = await SaleModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Sale updated successfully.',
                data: updatedSale,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error,
            },
            { status: 500 }
        );
    }
}
