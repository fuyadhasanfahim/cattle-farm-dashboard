import { ICattle } from '@/types/cattle.interface';
import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema<ICattle>(
    {
        tagId: {
            type: String,
            required: true,
        },
        registrationDate: {
            type: Date,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        stallNumber: {
            type: String,
            required: true,
        },
        breed: {
            type: String,
            required: false,
        },
        fatherName: {
            type: String,
            required: false,
        },
        fatherId: {
            type: String,
            required: false,
        },
        MilkingAndDryStatus: {
            type: String,
            required: true,
        },
        motherName: {
            type: String,
            required: false,
        },
        motherId: {
            type: String,
            required: false,
        },
        percentage: {
            type: String,
            required: false,
        },
        weight: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        fatteningStatus: {
            type: String,
            required: true,
        },
        cattleType: {
            type: String,
            required: true,
        },
        cattleCategory: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        profileImage: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const CattleModel =
    mongoose.models?.Cattle || mongoose.model<ICattle>('Cattle', cattleSchema);

export default CattleModel;
