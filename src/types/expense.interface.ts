export interface ICategory {
    _id?: string;
    name: string;
}

export interface ISeller {
    _id?: string;
    name: string;
    contact: string;
    address?: string;
}

export interface IBuyer {
    _id?: string;
    name: string;
    contact: string;
    address?: string;
}

export interface IPurchase {
    _id?: string;
    category: string;
    itemName?: string;
    quantity: number;
    pricePerItem?: number;
    price: number;
    purchaseDate: Date;
    sellerName: string;
    paymentStatus: string;
    paymentAmount: number;
    dueAmount?: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISale {
    _id?: string;
    category: string;
    itemName?: string;
    quantity: number;
    pricePerItem?: number;
    price: number;
    salesDate: Date;
    buyerName: string;
    paymentStatus: string;
    paymentAmount: number;
    dueAmount?: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
