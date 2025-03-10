import dbConfig from '@/lib/dbConfig';
import TreatmentModel from '@/models/treatment.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
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

        await TreatmentModel.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: 'Treatment deleted successfully.',
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
