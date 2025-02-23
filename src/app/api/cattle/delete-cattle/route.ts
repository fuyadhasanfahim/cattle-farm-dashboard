import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        console.log('Received DELETE request');

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        console.log('Extracted ID:', id);

        await dbConfig();

        const cattle = await CattleModel.findById(id);
        if (!cattle) {
            return NextResponse.json(
                { error: 'Cattle not found' },
                { status: 404 }
            );
        }

        await CattleModel.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Cattle deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to delete cattle',
                details: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
