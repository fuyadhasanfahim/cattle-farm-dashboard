import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ID is required',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const data = await CustomerModel.findOneAndDelete({ _id: id });

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Customer not found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Customer deleted successfully',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            {
                status: 500,
            }
        );
    }
}
