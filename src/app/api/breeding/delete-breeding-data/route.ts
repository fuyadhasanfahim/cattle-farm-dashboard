import dbConfig from '@/lib/dbConfig';
import BreedingModel from '@/models/breeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid ID provided.',
                },
                {
                    status: 400,
                }
            );
        }
        await dbConfig();

        await BreedingModel.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: 'Breeding deleted successfully.',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Something went wrong!',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
