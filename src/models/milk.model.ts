import IMilk from '@/types/milk.interface';
import { model, models, Schema } from 'mongoose';

const milkSchema = new Schema<IMilk>(
    {
        saleMilkAmount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MilkModel = models?.Milk || model<IMilk>('Milk', milkSchema);

export default MilkModel;
