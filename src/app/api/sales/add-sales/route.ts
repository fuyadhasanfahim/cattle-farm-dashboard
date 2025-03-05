import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import SalesModel from '@/models/sales.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    await dbConfig();

    try {
        const {
            salesType,
            salesDate,
            buyersPhoneNumber,
            buyersName,
            milkQuantity,
            perLiterPrice,
            totalPrice,
            paymentAmount,
            paymentMethod,
            dueAmount,
        } = await req.json();

        if (
            !salesType ||
            !salesDate ||
            !buyersPhoneNumber ||
            !buyersName ||
            !milkQuantity ||
            !perLiterPrice ||
            !totalPrice ||
            !paymentAmount ||
            !paymentMethod
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

        const newSale = new SalesModel({
            salesType,
            salesDate,
            buyersPhoneNumber,
            buyersName,
            milkQuantity,
            perLiterPrice,
            totalPrice,
            paymentAmount,
            paymentMethod,
            dueAmount,
        });

        await newSale.save();

        const lastMilkData = await MilkModel.findOne().sort('-createdAt');

        if (lastMilkData) {
            await MilkModel.create({
                saleMilkAmount: lastMilkData.saleMilkAmount - milkQuantity,
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Created Successfully!',
                data: newSale,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while creating a new sale.',
            error,
            status: 500,
        });
    }
}
