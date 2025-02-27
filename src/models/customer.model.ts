import { ICustomer, IPayment, ISale } from '@/types/customer.interface';
import { model, models, Schema } from 'mongoose';

const saleSchema = new Schema<ISale>(
    {
        তারিখ: {
            type: Date,
            required: true,
        },
        পণ্য_নাম: {
            type: String,
            required: true,
        },
        পরিমাণ: {
            type: Number,
            required: true,
        },
        মূল্য: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const paymentSchema = new Schema<IPayment>(
    {
        তারিখ: {
            type: Date,
            required: true,
        },
        পরিমাণ: {
            type: Number,
            required: true,
        },
        পদ্ধতি: {
            type: String,
            required: true,
        },
        মন্তব্য: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const customerSchema = new Schema<ICustomer>(
    {
        নাম: {
            type: String,
            required: true,
        },
        মোবাইল_নম্বর: {
            type: String,
            required: true,
        },
        ঠিকানা: {
            type: String,
            required: true,
        },
        মোট_বিক্রয়: {
            type: Number,
            default: 0,
        },
        মোট_পরিশোধ: {
            type: Number,
            default: 0,
        },
        মোট_বকেয়া: {
            type: Number,
            default: 0,
        },
        বিক্রয়_তালিকা: {
            type: [saleSchema],
            default: [],
        },
        পরিশোধ_তালিকা: {
            type: [paymentSchema],
            default: [],
        },
        গ্রাহকের_ধরণ: {
            type: String,
            required: false,
        },
        মন্তব্য: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const CustomerModel =
    models?.Customer || model<ICustomer>('Customer', customerSchema);
export default CustomerModel;
