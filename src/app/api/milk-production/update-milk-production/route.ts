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

        const lastMilkAmount = await MilkModel.findOne().sort('-createdAt');
        const retrieveMilkAmount = await MilkProductionModel.findById(id);

        const lastAmount = Number(lastMilkAmount?.saleMilkAmount) || 0;
        const retrieveAmount =
            Number(retrieveMilkAmount?.saleableMilkQuantity) || 0;
        const newAmount = Number(data?.saleableMilkQuantity) || 0;

        let newMilkAmount = lastAmount;

        if (retrieveAmount !== newAmount) {
            if (retrieveAmount > newAmount) {
                newMilkAmount -= retrieveAmount - newAmount;
            } else {
                newMilkAmount += newAmount - retrieveAmount;
            }

            await MilkModel.create({ saleMilkAmount: newMilkAmount });
        }

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
