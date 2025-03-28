import { z } from 'zod';

const BuyerValidationSchema = z.object({
    name: z.string().nonempty(),
    contact: z.string().nonempty(),
    address: z.string().optional(),
});

const PurchaseValidationSchema = z.object({
    category: z.string().nonempty(),
    itemName: z.string().nonempty(),
    quantity: z.string().nonempty(),
    pricePerItem: z.string().nonempty(),
    price: z.string().nonempty(),
    purchaseDate: z.date(),
    sellerName: z.string().nonempty(),
    paymentStatus: z.string().nonempty(),
    paymentAmount: z.string().nonempty(),
    dueAmount: z.string().nonempty(),
    notes: z.string().optional(),
});

const SaleValidationSchema = z.object({
    receiptNumber: z.string().optional(),
    category: z.string().nonempty(),
    itemName: z.string().nonempty(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    totalPrice: z.number().optional(),
    saleDate: z.date(),
    buyer: BuyerValidationSchema,
    note: z.string().optional(),
    paymentStatus: z.enum(['Due', 'Paid']),
    paymentType: z.enum(['Cash', 'Due']),
    paymentAmount: z.number().positive(),
    dueAmount: z.number().positive(),
});

export {
    BuyerValidationSchema,
    PurchaseValidationSchema,
    SaleValidationSchema,
};
