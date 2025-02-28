import dbConfig from "@/lib/dbConfig";
import MilkProductionModel from "@/models/milk.production.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConfig();

        const latestMilkProduction = await MilkProductionModel.findOne().sort({
            createdAt: -1,
        });

        if (!latestMilkProduction) {
            return NextResponse.json({
                success: false,
                message: "No milk production data found",
                status: 404,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Data retrieved successfully",
            data: latestMilkProduction,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message:
                (error as Error).message ||
                "An error occurred while processing the request",
            status: 500,
        });
    }
}
