export interface ISale {
    date: Date;
    productName: string;
    quantity: number;
    price: number;
}

export interface IPayment {
    date: Date;
    amount: number;
    method: string;
}

export interface ICustomer {
    _id: string;
    name: string;
    mobileNumber: string;
    address: string;
    totalSales: number;
    totalPayments: number;
    totalDue: number;
    salesList: ISale[];
    paymentList: IPayment[];
    customerType: string;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}
