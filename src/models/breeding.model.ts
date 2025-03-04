import { model } from 'mongoose';
import IBreeding from '@/types/breeding.interface';
import { models, Schema } from 'mongoose';

const breedingSchema = new Schema<IBreeding>(
    {
        mothersId: {
            type: String,
            ref: 'Cattle',
            required: true,
        },
        breedType: {
            type: String,
            required: true,
        },
        semenType: {
            type: String,
            required: true,
        },
        semenPercentage: {
            type: String,
            required: true,
        },
        semenCompanyName: {
            type: String,
            required: true,
        },
        approximateBirthDate: {
            type: Date,
            required: true,
        },
        semenDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pregnant', 'calf_registered', 'failed'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const BreedingModel =
    models?.Breeding || model<IBreeding>('Breeding', breedingSchema);

export default BreedingModel;
