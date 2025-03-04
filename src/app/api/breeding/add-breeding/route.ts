import BreedingModel from '@/models/breeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            mothersId,
            breedType,
            semenType,
            semenPercentage,
            semenCompanyName,
            approximateBirthDate,
            semenDate,
            status,
        } = await request.json();

        if (
            !mothersId ||
            !breedType ||
            !semenType ||
            !semenPercentage ||
            !semenCompanyName ||
            !approximateBirthDate ||
            !semenDate ||
            !status
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please fill all required fields!',
                },
                {
                    status: 400,
                }
            );
        }

        const data = new BreedingModel({
            mothersId,
            breedType,
            semenType,
            semenPercentage,
            semenCompanyName,
            approximateBirthDate,
            semenDate,
            status,
        });

        await data.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Breeding added successfully!',
                data,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
                error,
            },
            {
                status: 500,
            }
        );
    }
}
