import dbConfig from '@/lib/dbConfig';
import TreatmentModel from '@/models/treatment.model';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const treatmentSchema = z.object({
    cattleId: z.string().min(1, 'Cattle ID is required'),
    treatmentType: z.enum(['Deworming', 'Vaccination', 'General']),
    medicineName: z.string().min(1, 'Medicine name is required'),
    medicineAmount: z.string().optional(),
    medicineReason: z.string().optional(),
    vaccinationInterval: z.number().optional(),
    treatmentDate: z.string().datetime(),
});

export async function POST(request: NextRequest) {
    try {
        const inputData = await request.json();

        if (!Array.isArray(inputData)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Expected an array of treatment entries',
                },
                { status: 400 }
            );
        }

        const validationResults = inputData.map((entry) => {
            const result = treatmentSchema.safeParse(entry);
            return {
                valid: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.error,
            };
        });

        const invalidEntries = validationResults.filter((r) => !r.valid);
        if (invalidEntries.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Some entries are invalid',
                    errors: invalidEntries.map((e) => e.error),
                },
                { status: 400 }
            );
        }

        await dbConfig();

        const savedTreatments = [];
        const errors = [];

        for (const { data: validEntry } of validationResults) {
            try {
                const existingTreatment = await TreatmentModel.findOne({
                    cattleId: validEntry?.cattleId,
                    treatmentType: validEntry?.treatmentType,
                    treatmentDate: validEntry?.treatmentDate,
                });

                if (existingTreatment) {
                    errors.push({
                        cattleId: validEntry?.cattleId,
                        message: `Duplicate treatment found for cattle ${validEntry?.cattleId}`,
                    });
                    continue;
                }

                const newTreatment = new TreatmentModel(validEntry);
                await newTreatment.save();
                savedTreatments.push(newTreatment);
            } catch (error) {
                errors.push({
                    cattleId: validEntry?.cattleId,
                    message: `Failed to save treatment for cattle ${validEntry?.cattleId}`,
                    error: (error as Error).message,
                });
            }
        }

        if (errors.length > 0 && savedTreatments.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to save all treatments',
                    errors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Successfully saved ${savedTreatments.length} treatment(s)`,
                savedCount: savedTreatments.length,
                data: savedTreatments,
                ...(errors.length > 0 && {
                    partialErrors: {
                        count: errors.length,
                        errors,
                    },
                }),
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An unexpected error occurred',
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
