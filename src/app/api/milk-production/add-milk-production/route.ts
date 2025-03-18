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
            cattleType,
            totalMilkQuantity,
            saleableMilkQuantity,
            milkForConsumption,
            fatPercentage,
            time,
        } = await request.json();

        if (
            !milkCollectionDate ||
            !totalMilkQuantity ||
            !saleableMilkQuantity ||
            !milkForConsumption ||
            !time
        ) {
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
            cattleType,
            totalMilkQuantity: String(totalMilkQuantity),
            saleableMilkQuantity: String(saleableMilkQuantity),
            milkForConsumption: String(milkForConsumption),
            fatPercentage: fatPercentage ? String(fatPercentage) : undefined,
            time,
        });

        await milkProduction.save();

        const data = await MilkProductionModel.find();

        const totalSaleableMilk = await data?.reduce(
            (acc: number, item: { saleableMilkQuantity: string }) => {
                return acc + Number(item['saleableMilkQuantity']);
            },
            0
        );

        await MilkModel.create({
            saleMilkAmount: totalSaleableMilk,
        });

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
