import { IMilkProduction } from '@/types/milk.production.interface';
import { model, models, Schema } from 'mongoose';

const milkProductionSchema = new Schema<IMilkProduction>(
    {
        দুধ_সংগ্রহের_তারিখ: {
            type: Date,
            required: true,
        },
        গবাদি_পশুর_ধরণ: {
            type: String,
            required: true,
        },
        দুধের_পরিমাণ: {
            type: Number,
            required: true,
            default: 0,
        },
        মোট_দুধের_পরিমাণ: {
            type: Number,
            default: 0,
        },
        ফ্যাট_শতাংশ: {
            type: Number,
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

milkProductionSchema.post('save', async function () {
    const MilkProductionModel =
        models?.MilkProductions ||
        model('MilkProductions', milkProductionSchema);

    const totalMilk = await MilkProductionModel.aggregate([
        {
            $match: { _id: this._id },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$দুধের_পরিমাণ' },
            },
        },
    ]);

    const newTotal = totalMilk.length > 0 ? totalMilk[0].total : 0;

    await MilkProductionModel.findByIdAndUpdate(this._id, {
        মোট_দুধের_পরিমাণ: newTotal,
    });
});

const MilkProductionModel =
    models?.MilkProductions || model('MilkProductions', milkProductionSchema);

export default MilkProductionModel;
