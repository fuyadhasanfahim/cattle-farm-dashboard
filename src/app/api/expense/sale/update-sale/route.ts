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

        if (!id || !data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide valid data and ID.',
                },
                { status: 400 }
            );
        }

        const oldSale = await SaleModel.findById(id);

        if (!oldSale) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Sale not found.',
                },
                { status: 404 }
            );
        }

        const {
            paymentAmount: oldPayment = 0,
            dueAmount: oldDue = 0,
            paymentStatus: oldStatus = 'Pending',
        } = oldSale;

        const {
            paymentAmount: newPayment = 0,
            dueAmount: newDue = 0,
            paymentStatus: newStatus = 'Pending',
        } = data;

        const paymentDiff = newPayment - oldPayment;
        const dueDiff = newDue - oldDue;

        const updatedSale = await SaleModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (paymentDiff !== 0 || dueDiff !== 0 || oldStatus !== newStatus) {
            const balanceUpdate = {
                earning: 0,
                due: 0,
            };

            if (paymentDiff > 0) {
                balanceUpdate.earning += paymentDiff;
            } else if (paymentDiff < 0) {
                balanceUpdate.earning -= Math.abs(paymentDiff);
            }

            if (dueDiff !== 0) {
                balanceUpdate.due += dueDiff;
            }

            const shouldLog =
                balanceUpdate.earning !== 0 || balanceUpdate.due !== 0;

            if (shouldLog) {
                await BalanceModel.create({
                    ...balanceUpdate,
                });
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Sale updated and balances adjusted.',
                data: updatedSale,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while updating the sale.',
                error,
            },
            { status: 500 }
        );
    }
}
