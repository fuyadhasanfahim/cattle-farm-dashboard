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
        দুধের_পরিমাণ: {
            type: Number,
        },
        গবাদি_পশুর_ট্যাগ_আইডি: {
            type: String,
            required: true,
        },
        গবাদি_পশুর_ধরণ: {
            type: String,
            required: true,
        },
        প্রতি_লিটারের_দাম: {
            type: Number,
        },
        মোট_মূল্য: {
            type: Number,
        },
        বিক্রয়_মূল্য: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const SalesModel = models?.Sales || model<ISales>('Sales', salesSchema);

export default SalesModel;
