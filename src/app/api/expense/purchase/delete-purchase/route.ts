import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { PurchaseModel } from '@/models/expense.model';
import { IPurchase } from '@/types/expense.interface';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Invalid id provided.' },
                { status: 400 }
            );
        }

        const purchaseData = (await PurchaseModel.findById(id)) as IPurchase;

        if (!purchaseData) {
            return NextResponse.json(
                { success: false, message: 'Purchase not found.' },
                { status: 404 }
            );
        }

        await BalanceModel.create({
            balance: purchaseData.paymentAmount,
            due: -(purchaseData.dueAmount ?? 0),
            expense: -purchaseData.paymentAmount,
        });

        const deletedPurchase = await PurchaseModel.findByIdAndDelete(id);

        if (!deletedPurchase) {
            return NextResponse.json(
                { success: false, message: 'Purchase not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Purchase deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete purchase.', error },
            { status: 500 }
        );
    }
}
