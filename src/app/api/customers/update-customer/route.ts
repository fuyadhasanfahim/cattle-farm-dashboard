import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID is required' },
                { status: 400 }
            );
        }

        const { name, mobileNumber, address, customerType, comments } =
            await req.json();

        if (!name || !mobileNumber || !address || !customerType) {
            return NextResponse.json(
                { success: false, message: 'Request body cannot be empty' },
                { status: 400 }
            );
        }

        const updatedCustomer = await CustomerModel.findByIdAndUpdate(
            id,
            {
                $set: { name, mobileNumber, address, customerType, comments },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedCustomer) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Customer updated successfully',
                data: updatedCustomer,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}
