import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const {
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ধরণ,
            ফ্যাট_শতাংশ,
            মোট_দুধের_পরিমাণ,
            দুধের_পরিমাণ,
            সময়,
        } = await request.json();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (
            !দুধ_সংগ্রহের_তারিখ ||
            !গবাদি_পশুর_ধরণ ||
            !ফ্যাট_শতাংশ ||
            !মোট_দুধের_পরিমাণ ||
            !দুধের_পরিমাণ ||
            !সময়
        ) {
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
            await MilkProductionModel.findByIdAndUpdate(
                id,
                {
                    দুধ_সংগ্রহের_তারিখ,
                    গবাদি_পশুর_ধরণ,
                    ফ্যাট_শতাংশ,
                    দুধের_পরিমাণ,
                    সময়,
                    মোট_দুধের_পরিমাণ,
                },
                { new: true }
            );

        if (!updatedMilkProduction) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Milk production record not found!',
                },
                { status: 404 }
            );
        }

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
