import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import MilkProductionModel from '@/models/milk.production.model';
import { format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const entries = await request.json();

        // Check if entries is an array
        if (!Array.isArray(entries)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Expected an array of milk production entries',
                },
                { status: 400 }
            );
        }

        // Validate all entries
        for (const entry of entries) {
            const { milkCollectionDate, cattleTagId, milkQuantity, time } =
                entry;

            if (!milkCollectionDate || !milkQuantity || !time || !cattleTagId) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            'All fields (date, cattleTagId, quantity, time) are required for each entry!',
                    },
                    { status: 400 }
                );
            }
        }

        await dbConfig();

        const savedEntries = [];
        let totalMilkQuantity = 0;

        // Process each entry
        for (const entry of entries) {
            const {
                milkCollectionDate,
                cattleTagId,
                milkQuantity,
                fatPercentage,
                time,
            } = entry;

            const normalizedDate = format(
                new Date(milkCollectionDate),
                'yyyy-MM-dd'
            );

            // Check for duplicate
            const isDuplicate = await MilkProductionModel.findOne({
                milkCollectionDate: normalizedDate,
                cattleTagId,
                time,
            });

            if (isDuplicate) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Duplicate entry! Milk production record already exists for cattle ${cattleTagId} on ${normalizedDate} at ${time}.`,
                    },
                    { status: 409 }
                );
            }

            // Create new milk production record
            const milkProduction = new MilkProductionModel({
                milkCollectionDate,
                cattleTagId,
                milkQuantity,
                fatPercentage: fatPercentage || '',
                time,
            });

            await milkProduction.save();
            savedEntries.push(milkProduction);
            totalMilkQuantity += parseFloat(milkQuantity);
        }

        // Update the milk summary
        const lastMilkEntry = await MilkModel.findOne().sort({ _id: -1 });

        if (lastMilkEntry) {
            const newSaleMilkAmount =
                parseFloat(lastMilkEntry.saleMilkAmount) + totalMilkQuantity;
            lastMilkEntry.saleMilkAmount = newSaleMilkAmount.toFixed(2);
            await lastMilkEntry.save();
        } else {
            await MilkModel.create({
                saleMilkAmount: totalMilkQuantity.toFixed(2),
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: `${entries.length} milk production records added successfully!`,
                data: savedEntries,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error((error as Error).message);
        return NextResponse.json(
            {
                success: false,
                message: 'An unexpected error occurred.',
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
