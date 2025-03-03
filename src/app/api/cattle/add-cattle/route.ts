import { NextRequest, NextResponse } from 'next/server';
import CattleModel from '@/models/cattle.model';
import dbConfig from '@/lib/dbConfig';

export async function POST(req: NextRequest) {
    try {
        await dbConfig();

        const {
            ট্যাগ_আইডি,
            রেজিষ্ট্রেশনের_তারিখ,
            জন্ম_তারিখ,
            বয়স,
            স্টল_নম্বর,
            জাত,
            বাবার_নাম,
            বাবার_আইডি,
            মায়ের_নাম,
            মায়ের_আইডি,
            পার্সেন্টেজ,
            ওজন,
            লিঙ্গ,
            মোটাতাজা_করন_স্ট্যাটাস,
            গবাদিপশুর_ধরন,
            গবাদিপশুর_ক্যাটাগরি,
            অবস্থান,
            অবস্থা,
            বিবরন,
        } = await req.json();

        if (
            !ট্যাগ_আইডি ||
            !রেজিষ্ট্রেশনের_তারিখ ||
            !জন্ম_তারিখ ||
            !বয়স ||
            !স্টল_নম্বর ||
            !ওজন ||
            !লিঙ্গ ||
            !মোটাতাজা_করন_স্ট্যাটাস ||
            !গবাদিপশুর_ধরন ||
            !গবাদিপশুর_ক্যাটাগরি ||
            !অবস্থান ||
            !অবস্থা
        ) {
            return NextResponse.json({
                success: false,
                message: 'Please select all required fields!',
            });
        }

        const existingCattle = await CattleModel.findOne({
            ট্যাগ_আইডি,
        });
        if (existingCattle) {
            return NextResponse.json(
                { error: `Cattle with ID ${ট্যাগ_আইডি} already exists` },
                { status: 409 }
            );
        }

        const cattle = await CattleModel.create({
            ট্যাগ_আইডি,
            রেজিষ্ট্রেশনের_তারিখ,
            জন্ম_তারিখ,
            বয়স,
            স্টল_নম্বর,
            জাত,
            বাবার_নাম,
            বাবার_আইডি,
            মায়ের_নাম,
            মায়ের_আইডি,
            পার্সেন্টেজ,
            ওজন,
            লিঙ্গ,
            মোটাতাজা_করন_স্ট্যাটাস,
            গবাদিপশুর_ধরন,
            গবাদিপশুর_ক্যাটাগরি,
            অবস্থান,
            অবস্থা,
            বিবরন,
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
