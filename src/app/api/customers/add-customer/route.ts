import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const {
            নাম,
            মোবাইল_নম্বর,
            ঠিকানা,
            মোট_বিক্রয়,
            মোট_পরিশোধ,
            মোট_বকেয়া,
            বিক্রয়_তালিকা,
            পরিশোধ_তালিকা,
            গ্রাহকের_ধরণ,
            মন্তব্য,
        } = await req.json();

        if (
            !নাম ||
            !মোবাইল_নম্বর ||
            !ঠিকানা ||
            !গ্রাহকের_ধরণ
        ) {
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
            নাম,
            মোবাইল_নম্বর,
            ঠিকানা,
            মোট_বিক্রয়,
            মোট_পরিশোধ,
            মোট_বকেয়া,
            বিক্রয়_তালিকা,
            পরিশোধ_তালিকা,
            গ্রাহকের_ধরণ,
            মন্তব্য,
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
