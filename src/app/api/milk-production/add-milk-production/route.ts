import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ধরণ,
            ফ্যাট_শতাংশ,
            দুধের_পরিমাণ,
            সময়,
        } = await request.json();

        console.log('Request Body:', {
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ধরণ,
            ফ্যাট_শতাংশ,
            দুধের_পরিমাণ,
            সময়,
        });

        if (
            !দুধ_সংগ্রহের_তারিখ ||
            !গবাদি_পশুর_ধরণ ||
            !ফ্যাট_শতাংশ ||
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

        const normalizedDate = new Date(দুধ_সংগ্রহের_তারিখ)
            .toISOString()
            .split('T')[0];

        console.log('Normalized Date:', normalizedDate);

        const isDuplicate = await MilkProductionModel.findOne({
            দুধ_সংগ্রহের_তারিখ: {
                $gte: new Date(normalizedDate),
                $lt: new Date(
                    new Date(normalizedDate).setDate(
                        new Date(normalizedDate).getDate() + 1
                    )
                ),
            },
            সময়,
            দুধের_পরিমাণ,
        });

        if (isDuplicate) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Duplicate entry! Milk production record already exists for this date, cattle ID, time, and quantity.',
                },
                { status: 409 }
            );
        }

        const milkProduction = new MilkProductionModel({
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ধরণ,
            ফ্যাট_শতাংশ,
            দুধের_পরিমাণ,
            সময়,
        });

        await milkProduction.save();

        console.log('Milk Production Saved:', milkProduction);

        const totalMilk = await MilkProductionModel.aggregate([
            {
                $match: {
                    দুধ_সংগ্রহের_তারিখ: {
                        $gte: new Date(normalizedDate),
                        $lt: new Date(
                            new Date(normalizedDate).setDate(
                                new Date(normalizedDate).getDate() + 1
                            )
                        ),
                    },
                    গবাদি_পশুর_ধরণ,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$দুধের_পরিমাণ' },
                },
            },
        ]);

        console.log('Total Milk Aggregation Result:', totalMilk);

        const newTotal = totalMilk.length > 0 ? totalMilk[0].total : 0;

        await MilkProductionModel.findByIdAndUpdate(milkProduction._id, {
            মোট_দুধের_পরিমাণ: newTotal,
        });

        console.log('Updated Milk Production with Total:', newTotal);

        return NextResponse.json(
            {
                success: true,
                message: 'Milk production added successfully!',
                data: {
                    ...milkProduction.toObject(),
                    মোট_দুধের_পরিমাণ: newTotal,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            'Error in POST /api/milk-production/add-milk-production:',
            error
        );
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message ||
                    'An error occurred while adding milk production.',
            },
            { status: 500 }
        );
    }
}
