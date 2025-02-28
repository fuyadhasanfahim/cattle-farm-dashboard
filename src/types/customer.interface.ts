export interface ISale {
    তারিখ: Date;
    পণ্য_নাম: string;
    পরিমাণ: number;
    মূল্য: number;
}

export interface IPayment {
    তারিখ: Date;
    পরিমাণ: number;
    পদ্ধতি: string;
}

export interface ICustomer {
    _id: string;
    নাম: string;
    মোবাইল_নম্বর: string;
    ঠিকানা: string;
    মোট_বিক্রয়: number;
    মোট_পরিশোধ: number;
    মোট_বকেয়া: number;
    বিক্রয়_তালিকা: ISale[];
    পরিশোধ_তালিকা: IPayment[];
    গ্রাহকের_ধরণ: string;
    মন্তব্য?: string;
    createdAt: Date;
    updatedAt: Date;
}
