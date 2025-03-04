import { IFeeding } from '@/types/feeding.interface';
import { model, models, Schema } from 'mongoose';

const feedingSchema = new Schema<IFeeding>(
    {
        খাদ্যের_ধরণ: {
            type: String,
            required: true,
        },
        খাদ্যের_পরিমাণ: {
            type: Number,
            required: true,
        },
        তারিখ: {
            type: Date,
            required: true,
        },
        প্রতি_কেজির_দাম: {
            type: Number,
            required: true,
        },
        মোট_দাম: {
            type: Number,
            required: true,
        },
        পেমেন্টের_ধরণ: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const FeedingModel = models?.Feeding || model('Feeding', feedingSchema);

export default FeedingModel;
