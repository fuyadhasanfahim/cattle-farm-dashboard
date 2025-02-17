import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema(
    {
        cattleId: {
            type: String,
            required: [true, 'Cattle ID is required'],
        },
        registrationDate: {
            type: Date,
            required: [true, 'Registration date is required'],
        },
        birthDate: {
            type: Date,
            required: [true, 'Registration date is required'],
        },
        age: {
            type: String,
            required: [true, 'Age is required'],
        },
        stallNo: {
            type: String,
            required: [true, 'Stall number is required'],
        },
        weight: {
            type: String,
            required: [true, 'Weight is required'],
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
        },
        fatteningStatus: {
            type: String,
            required: [true, 'Fattening status is required'],
        },
        cattleType: {
            type: String,
            required: [true, 'Cattle type is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
        },
        transferStatus: {
            type: String,
            required: [true, 'Transfer status is required'],
        },
        deathStatus: {
            type: String,
            required: [true, 'Death status is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
    },
    {
        timestamps: true,
    }
);

const CattleModel =
    mongoose.models?.Cattle || mongoose.model('Cattle', cattleSchema);

export default CattleModel;
