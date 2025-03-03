import IMilk from '@/types/milk.interface';
import { model, models, Schema } from 'mongoose';

const milkSchema = new Schema<IMilk>(
    {
        বিক্রয়যোগ্য_দুধের_পরিমাণ: {
            type: Number,
            required: true,
        },
        খাওয়ার_দুধের_পরিমাণ: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MilkModel = models.Milk || model<IMilk>('Milk', milkSchema);

export default MilkModel;
