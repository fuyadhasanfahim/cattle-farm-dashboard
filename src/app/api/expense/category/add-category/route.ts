import dbConfig from '@/lib/dbConfig';
import { CategoryModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid input. All fields are required!',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const existingCategory = await CategoryModel.findOne({ name });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Category with the same value already exists!',
                },
                {
                    status: 400,
                }
            );
        }

        const data = await new CategoryModel({
            name,
        });

        await data.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Category added successfully!',
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
