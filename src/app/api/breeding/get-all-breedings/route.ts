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
                    message: 'Failed to fetch data',
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Data retrieved successfully',
            data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while processing the request',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
