import dbConfig from '@/lib/dbConfig';
import TreatmentModel from '@/models/treatment.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required.',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const newData = new TreatmentModel(data);
        await newData.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Treatment added successfully',
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to the database',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
