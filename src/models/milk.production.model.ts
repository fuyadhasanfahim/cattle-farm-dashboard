import { IMilkProduction } from '@/types/milk.production.interface';
import { model, models, Schema } from 'mongoose';

const milkProductionSchema = new Schema<IMilkProduction>(
    {
        দুধ_সংগ্রহের_তারিখ: {
            type: Date,
            required: true,
        },
        গবাদি_পশুর_ট্যাগ_আইডি: {
            type: String,
            required: false,
        },
        গবাদি_পশুর_ধরণ: {
            type: String,
            required: false,
        },
        মোট_দুধের_পরিমাণ: {
            type: String,
            required: true,
        },
        বিক্রি_যোগ্য_দুধের_পরিমাণ: {
            type: String,
            required: true,
        },
        খাওয়ার_জন্য_দুধের_পরিমাণ: {
            type: String,
            required: true,
        },
        ফ্যাট_শতাংশ: {
            type: String,
            required: false,
        },
        সময়: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MilkProductionModel =
    models?.MilkProductions || model('MilkProductions', milkProductionSchema);

export default MilkProductionModel;
