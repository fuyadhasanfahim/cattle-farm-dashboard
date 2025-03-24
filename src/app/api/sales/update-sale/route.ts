import dbConfig from '@/lib/dbConfig';
import SalesModel from '@/models/sales.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
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

        const formData = await req.json();

        if (!formData || Object.keys(formData).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or empty data provided.',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const data = await SalesModel.findByIdAndUpdate(id, formData, {
            new: true,
        });

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Sales not found.',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Sales updated successfully.',
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while updating sales.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
