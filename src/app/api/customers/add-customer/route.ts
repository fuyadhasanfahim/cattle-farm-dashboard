import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const {
            name,
            mobileNumber,
            address,
            totalSales,
            totalPayments,
            totalDue,
            salesList,
            paymentList,
            customerType,
            comments,
        } = await req.json();

        if (!name || !mobileNumber || !address || !customerType) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const result = new CustomerModel({
            name,
            mobileNumber,
            address,
            totalSales,
            totalPayments,
            totalDue,
            salesList,
            paymentList,
            customerType,
            comments,
        });

        await result.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Customer added successfully',
                data: result,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to the database',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
