import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CattleModel from '@/models/cattle.model';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        const requiredFields = [
            'cattleId',
            'registrationDate',
            'age',
            'stallNo',
            'weight',
            'gender',
            'fatteningStatus',
            'cattleType',
            'category',
            'transferStatus',
            'deathStatus',
            'description',
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const existingCattle = await CattleModel.findOne({
            cattleId: body.cattleId,
        });

        if (existingCattle) {
            return NextResponse.json(
                { error: `Cattle with ID ${body.cattleId} already exists` },
                { status: 409 }
            );
        }

        const cattle = await CattleModel.create(body);

        return NextResponse.json(
            { message: 'Cattle created successfully', cattle },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Error creating cattle' },
            { status: 500 }
        );
    }
}
