import { ICattle } from '@/types/cattle.interface';
import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema<ICattle>(
    {
        ট্যাগ_আইডি: {
            type: String,
            required: true,
        },
        রেজিষ্ট্রেশনের_তারিখ: {
            type: Date,
            required: true,
        },
        জন্ম_তারিখ: {
            type: Date,
            required: true,
        },
        বয়স: {
            type: String,
            required: true,
        },
        স্টল_নম্বর: {
            type: String,
            required: true,
        },
        জাত: {
            type: String,
            required: false,
        },
        বাবার_নাম: {
            type: String,
            required: false,
        },
        বাবার_আইডি: {
            type: String,
            required: false,
        },
        মায়ের_নাম: {
            type: String,
            required: false,
        },
        মায়ের_আইডি: {
            type: String,
            required: false,
        },
        পার্সেন্টেজ: {
            type: String,
            required: false,
        },
        ওজন: {
            type: String,
            required: [true, 'Weight is required'],
        },
        লিঙ্গ: {
            type: String,
            required: [true, 'Gender is required'],
        },
        মোটাতাজা_করন_স্ট্যাটাস: {
            type: String,
            required: [true, 'Fattening status is required'],
        },
        গবাদিপশুর_ধরন: {
            type: String,
            required: [true, 'Cattle type is required'],
        },
        গবাদিপশুর_ক্যাটাগরি: {
            type: String,
            required: [true, 'Category is required'],
        },
        অবস্থান: {
            type: String,
            required: [true, 'Transfer status is required'],
        },
        অবস্থা: {
            type: String,
            required: [true, 'Death status is required'],
        },
        বিবরন: {
            type: String,
            required: [true, 'Description is required'],
        },
    },
    {
        timestamps: true,
    }
);

const CattleModel =
    mongoose.models?.Cattle || mongoose.model<ICattle>('Cattle', cattleSchema);

export default CattleModel;
