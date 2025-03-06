import { model } from 'mongoose';
import IBreeding from '@/types/breeding.interface';
import { models, Schema } from 'mongoose';

const breedingSchema = new Schema<IBreeding>(
    {
        selectId: {
            type: Number,
            ref: 'Cattle',
            required: true,
        },
        bullName: {
            type: String,
            required: true,
        },
        bullNumber: {
            type: Number,
            required: true,
        },
        bullType: {
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
        semenDate: {
            type: Date,
            required: true,
        },
        checkForSemenSuccessResult: {
            type: Date,
            required: true,
        },
        approximateBirthdate: {
            type: Date,
            required: true,
        },
        checkForSemenSuccessStatus: {
            type: String,
            default: 'pending for approval',
        },
    },
    {
        timestamps: true,
    }
);

const BreedingModel =
    models?.Breeding || model<IBreeding>('Breeding', breedingSchema);

export default BreedingModel;
