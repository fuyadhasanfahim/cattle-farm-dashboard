import {
    IBuyer,
    ICategory,
    IPurchase,
    ISale,
    ISeller,
} from '@/types/expense.interface';
import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const SellerSchema = new Schema<ISeller>(
    {
        name: { type: String, required: true },
        contact: { type: String, required: true },
        address: { type: String },
    },
    {
        timestamps: true,
    }
);

const BuyerSchema = new Schema<IBuyer>(
    {
        name: { type: String, required: true },
        contact: { type: String, required: true },
        address: { type: String },
    },
    {
        timestamps: true,
    }
);

const PurchaseSchema = new Schema<IPurchase>(
    {
        category: { type: String, required: true },
        itemName: { type: String },
        quantity: { type: Number, required: true },
        pricePerItem: { type: Number, required: true },
        price: { type: Number, required: true },
        purchaseDate: { type: Date, required: true },
        sellerName: { type: String, required: true },
        paymentStatus: { type: String, required: true },
        paymentAmount: { type: Number, required: true },
        dueAmount: { type: Number, required: true },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

const SaleSchema = new Schema<ISale>(
    {
        category: { type: String, required: true },
        itemName: { type: String },
        quantity: { type: Number, required: true },
        pricePerItem: { type: Number, required: true },
        price: { type: Number, required: true },
        salesDate: { type: Date, required: true },
        buyerName: { type: String, required: true },
        notes: { type: String },
        paymentStatus: { type: String, required: true },
        paymentAmount: { type: Number, required: true },
        dueAmount: { type: Number },
    },
    {
        timestamps: true,
    }
);

const CategoryModel = models?.Category || model('Category', CategorySchema);
const SellerModel = models?.Seller || model<ISeller>('Seller', SellerSchema);
const BuyerModel = models?.Buyer || model<IBuyer>('Buyer', BuyerSchema);
const PurchaseModel =
    models?.Purchase || model<IPurchase>('Purchase', PurchaseSchema);
const SaleModel = models?.Sale || model<ISale>('Sale', SaleSchema);

export { CategoryModel, SellerModel, BuyerModel, PurchaseModel, SaleModel };
