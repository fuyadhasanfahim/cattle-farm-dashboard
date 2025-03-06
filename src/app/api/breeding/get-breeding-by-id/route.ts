import dbConfig from '@/lib/dbConfig';
import BreedingModel from '@/models/breeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
        await dbConfig();

        const data = await BreedingModel.findById(id);

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Breeding not found.',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Data retrieved successfully.',
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            {
                status: 500,
            }
        );
    }
}
