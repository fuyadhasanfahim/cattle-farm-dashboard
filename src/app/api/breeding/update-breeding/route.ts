import BreedingModel from '@/models/breeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

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

        const data = await request.json();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Request body cannot be empty',
                },
                {
                    status: 400,
                }
            );
        }

        await BreedingModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Breeding record updated successfully.',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
