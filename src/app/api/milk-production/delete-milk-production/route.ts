import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ID is required',
                },
                { status: 400 }
            );
        }

        const lastMilkAmountDoc = await MilkModel.findOne().sort('-createdAt');
        const retrieveMilkAmount = await MilkProductionModel.findById(id);

        const lastAmount = Number(lastMilkAmountDoc?.saleMilkAmount) || 0;
        const retrieveAmount = Number(retrieveMilkAmount?.milkQuantity) || 0;

        const newMilkAmount = lastAmount - retrieveAmount;

        if (newMilkAmount < 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Cannot delete. Resulting milk amount would be negative.',
                },
                { status: 400 }
            );
        }

        if (lastMilkAmountDoc) {
            lastMilkAmountDoc.saleMilkAmount = newMilkAmount.toFixed(2);
            await lastMilkAmountDoc.save();
        } else {
            return NextResponse.json(
                { success: false, message: 'Milk model not found' },
                { status: 404 }
            );
        }

        const result = await MilkProductionModel.findOneAndDelete({ _id: id });

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Milk production not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Milk production deleted successfully',
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message ||
                    'An error occurred while processing the request',
            },
            { status: 500 }
        );
    }
}
