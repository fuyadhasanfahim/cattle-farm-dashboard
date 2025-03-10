import TreatmentModel from '@/models/treatment.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
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

        const result = await TreatmentModel.findOneAndUpdate(
            {
                _id: id,
            },
            data
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
            },
            {
                status: 200,
            }
        );
    } catch (error) {
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
