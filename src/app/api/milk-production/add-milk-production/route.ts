import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            দুধ_সংগ্রহের_তারিখ,
            গবাদি_পশুর_ধরণ,
            ফ্যাট_শতাংশ,
            গবাদি_পশুর_ট্যাগ_আইডি,
            দুধের_পরিমাণ,
            সময়,
        } = await request.json();

        if (
            !দুধ_সংগ্রহের_তারিখ ||
            !গবাদি_পশুর_ধরণ ||
            !ফ্যাট_শতাংশ ||
            !গবাদি_পশুর_ট্যাগ_আইডি ||
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

        const isIdExist = await CattleModel.findOne({
            ট্যাগ_আইডি: গবাদি_পশুর_ট্যাগ_আইডি,
        });

        if (!isIdExist) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cattle ID not found!',
                },
                { status: 404 }
            );
        }

        const normalizedDate = new Date(দুধ_সংগ্রহের_তারিখ)
            .toISOString()
            .split('T')[0];

        const isDuplicate = await MilkProductionModel.findOne({
            দুধ_সংগ্রহের_তারিখ: {
                $gte: new Date(normalizedDate),
                $lt: new Date(
                    new Date(normalizedDate).setDate(
                        new Date(normalizedDate).getDate() + 1
                    )
                ),
            },
            গবাদি_পশুর_ট্যাগ_আইডি,
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
            গবাদি_পশুর_ট্যাগ_আইডি,
            দুধের_পরিমাণ,
            সময়,
        });

        await milkProduction.save();

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
                    (error as Error).message ||
                    'An error occurred while adding milk production.',
            },
            { status: 500 }
        );
    }
}
