import { ISales } from '@/types/sales.interface';
import { model, models, Schema } from 'mongoose';

const salesSchema = new Schema<ISales>(
    {
        বিক্রয়ের_ধরণ: {
            type: String,
            required: true,
        },
        বিক্রয়ের_তারিখ: {
            type: Date,
            required: true,
        },
        গ্রাহকের_মোবাইল_নম্বর: {
            type: String,
            required: false,
        },
        গ্রাহকের_নাম: {
            type: String,
            required: false,
        },
        দুধের_পরিমাণ: {
            type: String,
            required: true,
        },
        প্রতি_লিটারের_দাম: {
            type: String,
            required: true,
        },
        মোট_মূল্য: {
            type: String,
            required: true,
        },
        পরিশোধিত_পরিমাণ: {
            type: String,
            required: true,
        },
        পরিশোধ_পদ্ধতি: {
            type: String,
            required: true,
        },
        বকেয়া_পরিমাণ: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const SalesModel = models?.Sales || model<ISales>('Sales', salesSchema);

export default SalesModel;
