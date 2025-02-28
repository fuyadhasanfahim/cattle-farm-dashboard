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
            type: Number,
        },
        প্রতি_লিটারের_দাম: {
            type: Number,
        },
        মোট_মূল্য: {
            type: Number,
        },
        পরিশোধিত_পরিমাণ: {
            type: Number,
        },
        পরিশোধ_পদ্ধতি: {
            type: String,
            required: true,
        },
        বকেয়া_পরিমাণ: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const SalesModel = models?.Sales || model<ISales>('Sales', salesSchema);

export default SalesModel;
