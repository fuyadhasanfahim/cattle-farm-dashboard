import dbConfig from "@/lib/dbConfig";
import SalesModel from "@/models/sales.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConfig();

    try {
        const {
            বিক্রয়ের_ধরণ,
            বিক্রয়ের_তারিখ,
            গ্রাহকের_নাম,
            গ্রাহকের_মোবাইল_নম্বর,
            দুধের_পরিমাণ,
            পরিশোধ_পদ্ধতি,
            পরিশোধিত_পরিমাণ,
            প্রতি_লিটারের_দাম,
            বকেয়া_পরিমাণ,
            মোট_মূল্য,
        } = await req.json();

        if (
            !বিক্রয়ের_ধরণ ||
            !বিক্রয়ের_তারিখ ||
            !গ্রাহকের_নাম ||
            !গ্রাহকের_মোবাইল_নম্বর ||
            !দুধের_পরিমাণ ||
            !পরিশোধ_পদ্ধতি ||
            !পরিশোধিত_পরিমাণ ||
            !প্রতি_লিটারের_দাম ||
            !বকেয়া_পরিমাণ ||
            !মোট_মূল্য
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please fill all required fields!",
                },
                {
                    status: 400,
                }
            );
        }

        const newSale = new SalesModel({
            বিক্রয়ের_ধরণ,
            বিক্রয়ের_তারিখ,
            গ্রাহকের_নাম,
            গ্রাহকের_মোবাইল_নম্বর,
            দুধের_পরিমাণ,
            পরিশোধ_পদ্ধতি,
            পরিশোধিত_পরিমাণ,
            প্রতি_লিটারের_দাম,
            বকেয়া_পরিমাণ,
            মোট_মূল্য,
        });

        await newSale.save();

        return NextResponse.json(
            {
                success: true,
                message: "Created Successfully!",
                data: newSale,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An error occurred while creating a new sale.",
            error,
            status: 500,
        });
    }
}
