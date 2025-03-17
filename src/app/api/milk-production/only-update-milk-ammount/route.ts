import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    await dbConfig();

    try {
        const { milkQuantity } = await req.json();

        if (!milkQuantity) {
            return NextResponse.json({
                error: 'Milk quantity not provided.',
            });
        }

        const soldMilkAmount = Number(milkQuantity);

        if (isNaN(soldMilkAmount) || soldMilkAmount <= 0) {
            return NextResponse.json({
                error: 'Please provide a valid milk quantity.',
            });
        }

        const latestMilkProduction = await MilkProductionModel.findOne().sort({
            createdAt: -1,
        });

        if (!latestMilkProduction) {
            return NextResponse.json({
                error: 'No milk production data found.',
            });
        }

        const currentMilkAmount = Number(
            latestMilkProduction.totalMilkQuantity
        );

        if (isNaN(currentMilkAmount)) {
            return NextResponse.json({
                error: 'Total milk quantity not correctly stored in the database.',
            });
        }

        const updatedMilkAmount = currentMilkAmount - soldMilkAmount;

        if (updatedMilkAmount < 0) {
            return NextResponse.json({
                error: `Insufficient milk. Currently, total milk quantity is ${currentMilkAmount} liters.`,
            });
        }

        const updatedDoc = await MilkProductionModel.findOneAndUpdate(
            { _id: latestMilkProduction._id },
            { $set: { totalMilkQuantity: updatedMilkAmount } },
            { new: true }
        );

        if (!updatedDoc) {
            return NextResponse.json({
                error: 'Failed to update milk quantity.',
            });
        }

        return NextResponse.json({
            message: 'Total milk quantity updated successfully.',
            updatedMilkAmount: updatedDoc.totalMilkQuantity,
        });
    } catch (error) {
        console.error('Milk update error:', error);
        return NextResponse.json({ error: 'Internal server error.' });
    }
}
