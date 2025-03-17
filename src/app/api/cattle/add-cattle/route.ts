import { NextRequest, NextResponse } from 'next/server';
import CattleModel from '@/models/cattle.model';
import dbConfig from '@/lib/dbConfig';

export async function POST(req: NextRequest) {
    try {
        await dbConfig();

        const {
            tagId,
            registrationDate,
            dateOfBirth,
            age,
            stallNumber,
            breed,
            fatherName,
            fatherId,
            motherName,
            motherId,
            percentage,
            weight,
            gender,
            fatteningStatus,
            cattleType,
            cattleCategory,
            location,
            status,
            description,
        } = await req.json();

        if (
            !tagId ||
            !registrationDate ||
            !dateOfBirth ||
            !age ||
            !stallNumber ||
            !weight ||
            !gender ||
            !fatteningStatus ||
            !cattleType ||
            !cattleCategory ||
            !location ||
            !status
        ) {
            return NextResponse.json({
                success: false,
                message: 'Please select all required fields!',
            });
        }

        const existingCattle = await CattleModel.findOne({
            tagId,
        });
        if (existingCattle) {
            return NextResponse.json(
                { error: `Cattle with ID ${tagId} already exists` },
                { status: 409 }
            );
        }

        const cattle = await CattleModel.create({
            tagId,
            registrationDate,
            dateOfBirth,
            age,
            stallNumber,
            breed,
            fatherName,
            fatherId,
            motherName,
            motherId,
            percentage,
            weight,
            gender,
            fatteningStatus,
            cattleType,
            cattleCategory,
            location,
            status,
            description,
        });

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
