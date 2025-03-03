import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import MilkProductionModel from '@/models/milk.production.model';
import { format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ট্যাগ_আইডি,
            গবাদি_পশুর_ধরণ,
            মোট_দুধের_পরিমাণ,
            বিক্রি_যোগ্য_দুধের_পরিমাণ,
            খাওয়ার_জন্য_দুধের_পরিমাণ,
            ফ্যাট_শতাংশ,
            সময়,
        } = await request.json();

        if (
            !দুধ_সংগ্রহের_তারিখ ||
            !গবাদি_পশুর_ট্যাগ_আইডি ||
            !গবাদি_পশুর_ধরণ ||
            !মোট_দুধের_পরিমাণ ||
            !বিক্রি_যোগ্য_দুধের_পরিমাণ ||
            !খাওয়ার_জন্য_দুধের_পরিমাণ ||
            !সময়
        ) {
            return NextResponse.json(
                { success: false, message: 'All fields are required!' },
                { status: 400 }
            );
        }

        await dbConfig();

        const normalizedDate = format(
            new Date(দুধ_সংগ্রহের_তারিখ),
            'yyyy-MM-dd'
        );

        const isDuplicate = await MilkProductionModel.findOne({
            দুধ_সংগ্রহের_তারিখ: normalizedDate,
            গবাদি_পশুর_ট্যাগ_আইডি,
            সময়,
        });

        if (isDuplicate) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Duplicate entry! Milk production record already exists for this date, cattle ID, and time.',
                },
                { status: 409 }
            );
        }

        const milkProduction = new MilkProductionModel({
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ট্যাগ_আইডি,
            গবাদি_পশুর_ধরণ,
            মোট_দুধের_পরিমাণ: String(মোট_দুধের_পরিমাণ),
            বিক্রি_যোগ্য_দুধের_পরিমাণ: String(বিক্রি_যোগ্য_দুধের_পরিমাণ),
            খাওয়ার_জন্য_দুধের_পরিমাণ: String(খাওয়ার_জন্য_দুধের_পরিমাণ),
            ফ্যাট_শতাংশ: ফ্যাট_শতাংশ ? String(ফ্যাট_শতাংশ) : undefined,
            সময়,
        });

        await milkProduction.save();

        const soldMilkAmount = Number(বিক্রি_যোগ্য_দুধের_পরিমাণ);
        const milkForDrink = Number(খাওয়ার_জন্য_দুধের_পরিমাণ);

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
                message: 'Milk production added successfully!',
                data: milkProduction,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred.',
            },
            { status: 500 }
        );
    }
}
