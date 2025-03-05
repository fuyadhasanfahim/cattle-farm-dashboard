import MilkModel from '@/models/milk.model';
import SalesModel from '@/models/sales.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Invalid id.',
            });
        }

        const lastMilkAmount = await MilkModel.findOne().sort('-createdAt');

        const retrieveMilkAmount = await SalesModel.findById(id);

        const lastAmount = lastMilkAmount?.saleMilkAmount as number;

        const retrieveAmount = retrieveMilkAmount?.milkQuantity as number;

        const newMilkAmount = lastAmount + retrieveAmount;

        await MilkModel.create({ saleMilkAmount: newMilkAmount });

        await SalesModel.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Sales record deleted successfully.',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete milk production record.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
