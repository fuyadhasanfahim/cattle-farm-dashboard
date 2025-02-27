import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
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

        const updatedMilkProduction =
            await MilkProductionModel.findOneAndUpdate(
                { গবাদি_পশুর_ট্যাগ_আইডি },
                {
                    দুধ_সংগ্রহের_তারিখ,
                    গবাদি_পশুর_ধরণ,
                    ফ্যাট_শতাংশ,
                    দুধের_পরিমাণ,
                    সময়,
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
