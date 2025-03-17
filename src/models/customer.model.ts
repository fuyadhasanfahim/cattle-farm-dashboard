import { ICustomer, IPayment, ISale } from '@/types/customer.interface';
import { model, models, Schema } from 'mongoose';

const saleSchema = new Schema<ISale>(
    {
        date: {
            type: Date,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
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
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const customerSchema = new Schema<ICustomer>(
    {
        name: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        totalSales: {
            type: Number,
            default: 0,
        },
        totalPayments: {
            type: Number,
            default: 0,
        },
        totalDue: {
            type: Number,
            default: 0,
        },
        salesList: {
            type: [saleSchema],
            default: [],
        },
        paymentList: {
            type: [paymentSchema],
            default: [],
        },
        customerType: {
            type: String,
            required: false,
        },
        comments: {
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
