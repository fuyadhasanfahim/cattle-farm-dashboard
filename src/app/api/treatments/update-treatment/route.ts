import dbConfig from '@/lib/dbConfig';
import TreatmentModel from '@/models/treatment.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        const data = await request.json();

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid id provided.',
                },
                {
                    status: 400,
                }
            );
        }

        const treatmentDate = new Date(data.treatmentDate || new Date());

        if (data.treatmentType === 'Deworming') {
            const nextDueDate = new Date(treatmentDate);
            nextDueDate.setMonth(nextDueDate.getMonth() + 3);
            data.nextDueDate = nextDueDate;

            data.$inc = { ...data.$inc, dewormingCount: 1 };
        } else if (
            data.treatmentType === 'Vaccination' &&
            data.vaccinationInterval
        ) {
            const nextDueDate = new Date(treatmentDate);
            nextDueDate.setMonth(
                nextDueDate.getMonth() + data.vaccinationInterval
            );
            data.nextDueDate = nextDueDate;

            data.$inc = { ...data.$inc };
        } else if (data.treatmentType === 'General') {
            data.$inc = { ...data.$inc };
        }

        const result = await TreatmentModel.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Treatment not found.',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Treatment updated successfully.',
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error('Error updating treatment:', (error as Error).message);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while updating treatment.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
