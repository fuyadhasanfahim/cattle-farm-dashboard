import MilkModel from '@/models/milk.model';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
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

        const lastMilkAmount = await MilkModel.findOne().sort('-createdAt');

        const retrieveMilkAmount = await MilkProductionModel.findById(id);

        const lastAmount = Number(lastMilkAmount?.saleMilkAmount) || 0;

        const retrieveAmount =
            Number(retrieveMilkAmount?.বিক্রি_যোগ্য_দুধের_পরিমাণ) || 0;

        const newMilkAmount = lastAmount - retrieveAmount;

        await MilkModel.create({ saleMilkAmount: newMilkAmount });

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
