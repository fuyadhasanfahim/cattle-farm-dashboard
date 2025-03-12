export interface IFeedPurchase {
    _id?: string;
    feedType: string;
    purchaseDate: Date;
    quantityPurchased: number;
    perKgPrice: number;
    totalPrice: number;
    paymentType: string;
}

export interface IFeedingLog {
    _id?: string;
    cattleId: string;
    feedType: string;
    feedDate: Date;
    feedAmount: number;
}

export interface IFeedInventory {
    _id?: string;
    feedType: string;
    totalStock: number;
    lastUpdated: Date;
}
