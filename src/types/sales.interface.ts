export interface ISales {
    _id?: string;
    salesType: string;
    salesDate: Date;
    buyersPhoneNumber: string;
    buyersName: string;
    milkQuantity: number;
    perLiterPrice: number;
    totalPrice: number;
    paymentAmount: number;
    paymentMethod: string;
    dueAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
