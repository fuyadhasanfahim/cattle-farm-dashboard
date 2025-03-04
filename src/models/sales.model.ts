import { ISales } from '@/types/sales.interface';
import { model, models, Schema } from 'mongoose';

const salesSchema = new Schema<ISales>(
    {
        salesType: {
            type: String,
            required: true,
        },
        salesDate: {
            type: Date,
            required: true,
        },
        buyersPhoneNumber: {
            type: String,
            required: false,
        },
        buyersName: {
            type: String,
            required: false,
        },
        milkQuantity: {
            type: Number,
            required: true,
        },
        perLiterPrice: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        dueAmount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const SalesModel = models?.Sales || model<ISales>('Sales', salesSchema);

export default SalesModel;
