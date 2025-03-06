import BreedingModel from '@/models/breeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            selectId,
            bullName,
            bullNumber,
            bullType,
            semenPercentage,
            semenCompanyName,
            semenDate,
            checkForSemenSuccessResult,
            approximateBirthdate,
            checkForSemenSuccessStatus,
        } = await request.json();

        if (
            !selectId ||
            !bullName ||
            !bullNumber ||
            !bullType ||
            !semenPercentage ||
            !semenCompanyName ||
            !semenDate ||
            !checkForSemenSuccessResult ||
            !approximateBirthdate
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
            selectId,
            bullName,
            bullNumber,
            bullType,
            semenPercentage,
            semenCompanyName,
            semenDate,
            checkForSemenSuccessResult,
            approximateBirthdate,
            checkForSemenSuccessStatus,
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
        console.log(error)
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
