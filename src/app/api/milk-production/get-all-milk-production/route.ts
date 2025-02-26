import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const milkProductions = await MilkProductionModel.find();

        if (!milkProductions) {
            throw new Error(`Could not find milk production data`);
        }

        return NextResponse.json(milkProductions, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}
