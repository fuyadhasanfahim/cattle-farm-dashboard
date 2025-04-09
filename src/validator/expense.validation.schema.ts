import { z } from 'zod';

const BuyerValidationSchema = z.object({
    name: z.string().nonempty(),
    contact: z.string().nonempty(),
    address: z.string().optional(),
});

const PurchaseValidationSchema = z.object({
    category: z.string().nonempty(),
    itemName: z.string(),
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
    category: z.string().nonempty(),
    itemName: z.string().optional(),
    quantity: z.string().nonempty(),
    pricePerItem: z.string().nonempty(),
    price: z.string().nonempty(),
    salesDate: z.date(),
    buyerName: z.string().nonempty(),
    paymentStatus: z.string().nonempty(),
    paymentAmount: z.string().nonempty(),
    dueAmount: z.string().nonempty(),
    notes: z.string().optional(),
});

export {
    BuyerValidationSchema,
    PurchaseValidationSchema,
    SaleValidationSchema,
};
