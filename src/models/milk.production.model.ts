import { IMilkProduction } from '@/types/milk.production.interface';
import { model, models, Schema } from 'mongoose';

const milkProductionSchema = new Schema<IMilkProduction>(
    {
        গবাদি_পশুর_ট্যাগ_আইডি: {
            type: String,
            required: true,
        },
        দুধ_সংগ্রহের_তারিখ: {
            type: Date,
            required: true,
        },
        গবাদি_পশুর_ধরণ: {
            type: String,
            required: true,
        },
        দুধের_পরিমাণ: {
            type: String,
            required: true,
        },
        ফ্যাট_শতাংশ: {
            type: String,
            required: true,
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
