import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required!',
                },
                { status: 400 }
            );
        }

        await dbConfig();

        const updatedMilkProduction =
            await MilkProductionModel.findByIdAndUpdate(id, data, {
                new: true,
            });

        if (!updatedMilkProduction) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Milk production record not found!',
                },
                { status: 404 }
            );
        }

        const soldMilkAmount = Number(data.বিক্রি_যোগ্য_দুধের_পরিমাণ);
        const milkForDrink = Number(data.খাওয়ার_জন্য_দুধের_পরিমাণ);

        await MilkModel.findOneAndUpdate(
            {},
            {
                $inc: {
                    বিক্রয়যোগ্য_দুধের_পরিমাণ: soldMilkAmount,
                    খাওয়ার_দুধের_পরিমাণ: milkForDrink,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Milk production updated successfully!',
                data: updatedMilkProduction,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message ||
                    'An error occurred while updating milk production.',
            },
            { status: 500 }
        );
    }
}
