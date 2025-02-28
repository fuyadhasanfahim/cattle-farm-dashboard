import dbConfig from "@/lib/dbConfig";
import MilkProductionModel from "@/models/milk.production.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    await dbConfig();

    try {
        const { দুধের_পরিমাণ } = await req.json();

        if (!দুধের_পরিমাণ) {
            return NextResponse.json({
                error: "দুধের পরিমাণ প্রদান করা হয়নি।",
            });
        }

        const soldMilkAmount = Number(দুধের_পরিমাণ);

        if (isNaN(soldMilkAmount) || soldMilkAmount <= 0) {
            return NextResponse.json({
                error: "সঠিক দুধের পরিমাণ প্রদান করুন।",
            });
        }

        // Find the latest milk production record
        const latestMilkProduction = await MilkProductionModel.findOne().sort({
            createdAt: -1,
        });

        if (!latestMilkProduction) {
            return NextResponse.json({
                error: "কোনো দুধ উৎপাদন ডাটা পাওয়া যায়নি।",
            });
        }

        let currentMilkAmount = Number(latestMilkProduction.মোট_দুধের_পরিমাণ);

        if (isNaN(currentMilkAmount)) {
            return NextResponse.json({
                error: "ডাটাবেজে মোট দুধের পরিমাণ সঠিকভাবে সংরক্ষিত নেই।",
            });
        }

        const updatedMilkAmount = currentMilkAmount - soldMilkAmount;

        console.log(`Previous Milk Amount: ${currentMilkAmount}`);
        console.log(`Sold Milk Amount: ${soldMilkAmount}`);
        console.log(`Updated Milk Amount: ${updatedMilkAmount}`);

        if (updatedMilkAmount < 0) {
            return NextResponse.json({
                error: `পর্যাপ্ত দুধ নেই। বর্তমানে মোট দুধের পরিমাণ ${currentMilkAmount} লিটার।`,
            });
        }

        // ✅ Use findOneAndUpdate to update the latest document
        const updatedDoc = await MilkProductionModel.findOneAndUpdate(
            { _id: latestMilkProduction._id },
            { $set: { মোট_দুধের_পরিমাণ: updatedMilkAmount } },
            { new: true } // This returns the updated document
        );

        if (!updatedDoc) {
            return NextResponse.json({
                error: "দুধের পরিমাণ আপডেট করা যায়নি।",
            });
        }

        return NextResponse.json({
            message: "মোট দুধের পরিমাণ সফলভাবে আপডেট হয়েছে।",
            updatedMilkAmount: updatedDoc.মোট_দুধের_পরিমাণ,
        });
    } catch (error) {
        console.error("Milk update error:", error);
        return NextResponse.json({ error: "অভ্যন্তরীণ সার্ভার সমস্যা।" });
    }
}
