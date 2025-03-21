import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import MilkProductionModel from '@/models/milk.production.model';
import { format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            milkCollectionDate,
            cattleTagId,
            milkQuantity,
            fatPercentage,
            time,
        } = await request.json();

        if (!milkCollectionDate || !milkQuantity || !time) {
            return NextResponse.json(
                { success: false, message: 'All fields are required!' },
                { status: 400 }
            );
        }

        await dbConfig();

        const normalizedDate = format(
            new Date(milkCollectionDate),
            'yyyy-MM-dd'
        );

        const isDuplicate = await MilkProductionModel.findOne({
            milkCollectionDate: normalizedDate,
            cattleTagId,
            time,
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
            milkCollectionDate,
            cattleTagId,
            milkQuantity,
            fatPercentage,
            time,
        });

        const lastMilkEntry = await MilkModel.findOne().sort({ _id: -1 });

        if (lastMilkEntry) {
            const newSaleMilkAmount =
                parseFloat(lastMilkEntry.saleMilkAmount) +
                parseFloat(milkQuantity);
            lastMilkEntry.saleMilkAmount = newSaleMilkAmount.toFixed(2);

            await lastMilkEntry.save();
        } else {
            await MilkModel.create({
                saleMilkAmount: parseFloat(milkQuantity).toFixed(2),
            });
        }

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
        console.log((error as Error).message);
        return NextResponse.json(
            {
                success: false,
                message: 'An unexpected error occurred.',
                error,
            },
            { status: 500 }
        );
    }
}
