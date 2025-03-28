import dbConfig from '@/lib/dbConfig';
import { PurchaseModel } from '@/models/expense.model';
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
        console.error('DELETE API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete purchase.', error },
            { status: 500 }
        );
    }
}
