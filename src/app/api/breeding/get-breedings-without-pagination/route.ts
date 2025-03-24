import dbConfig from '@/lib/dbConfig';
import BreedingModel from '@/models/breeding.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await BreedingModel.find();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No data found!',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved breedings data.',
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
                message: 'Something went wrong!',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
