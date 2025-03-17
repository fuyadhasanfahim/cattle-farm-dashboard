import { IMilkProduction } from '@/types/milk.production.interface';
import { model, models, Schema } from 'mongoose';

const milkProductionSchema = new Schema<IMilkProduction>(
    {
        milkCollectionDate: {
            type: Date,
            required: true,
        },
        cattleTagId: {
            type: String,
            required: false,
        },
        totalMilkQuantity: {
            type: String,
            required: true,
        },
        saleableMilkQuantity: {
            type: String,
            required: true,
        },
        milkForConsumption: {
            type: String,
            required: true,
        },
        fatPercentage: {
            type: String,
            required: false,
        },
        time: {
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
