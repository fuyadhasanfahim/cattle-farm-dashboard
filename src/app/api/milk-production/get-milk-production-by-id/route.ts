import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const data = await MilkProductionModel.findById(id);
        if (!data) {
            return NextResponse.json(
                { error: 'Milk production not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    (error as Error).message ||
                    'An error occurred while processing the request',
            },
            { status: 500 }
        );
    }
}
