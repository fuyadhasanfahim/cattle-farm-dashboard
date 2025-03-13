import { Schema, model, models } from 'mongoose';

const FeedPurchaseSchema = new Schema({
    feedType: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantityPurchased: { type: Number, required: true },
    perKgPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentType: { type: String, required: true },
});

const FeedInventorySchema = new Schema({
    feedType: { type: String, required: true, unique: true },
    totalStock: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
});

const FeedingLogSchema = new Schema({
    cattleId: { type: String, ref: 'Cattle', required: false },
    feedType: { type: String, required: true },
    feedDate: { type: Date, default: Date.now },
    feedAmount: { type: Number, required: true },
});

export const FeedPurchaseModel =
    models?.FeedPurchase || model('FeedPurchase', FeedPurchaseSchema);

export const FeedInventoryModel =
    models?.FeedInventory || model('FeedInventory', FeedInventorySchema);

export const FeedingLogModel =
    models?.FeedingLog || model('FeedingLog', FeedingLogSchema);
