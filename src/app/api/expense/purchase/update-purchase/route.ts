import dbConfig from '@/lib/dbConfig';
import { PurchaseModel } from '@/models/expense.model';
import BalanceModel from '@/models/balance.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');
        const newData = await req.json();

        if (!id || !newData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide valid data and ID.',
                },
                { status: 400 }
            );
        }

        await dbConfig();

        const oldPurchase = await PurchaseModel.findById(id);
        if (!oldPurchase) {
            return NextResponse.json(
                { success: false, message: 'Purchase not found.' },
                { status: 404 }
            );
        }

        const {
            paymentAmount: oldPayment = 0,
            dueAmount: oldDue = 0,
            paymentStatus: oldStatus = 'Pending',
        } = oldPurchase;

        const {
            paymentAmount: newPayment = 0,
            dueAmount: newDue = 0,
            paymentStatus: newStatus = 'Pending',
        } = newData;

        const paymentDiff = newPayment - oldPayment;
        const dueDiff = newDue - oldDue;

        const updatedPurchase = await PurchaseModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (paymentDiff !== 0 || dueDiff !== 0 || oldStatus !== newStatus) {
            const balanceUpdate = {
                balance: 0,
                expense: 0,
                due: 0,
            };

            if (paymentDiff > 0) {
                balanceUpdate.balance -= paymentDiff;
                balanceUpdate.expense += paymentDiff;
            } else if (paymentDiff < 0) {
                balanceUpdate.balance += Math.abs(paymentDiff);
                balanceUpdate.expense -= Math.abs(paymentDiff);
            }

            if (dueDiff !== 0) {
                balanceUpdate.due += dueDiff;
            }

            const shouldLog =
                balanceUpdate.balance !== 0 ||
                balanceUpdate.expense !== 0 ||
                balanceUpdate.due !== 0;

            if (shouldLog) {
                await BalanceModel.create({
                    ...balanceUpdate,
                });
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Purchase updated and balances adjusted.',
                data: updatedPurchase,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while updating the purchase.',
                error,
            },
            { status: 500 }
        );
    }
}
