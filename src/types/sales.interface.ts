export interface ISales {
    _id?: string;
    বিক্রয়ের_ধরণ: string;
    বিক্রয়ের_তারিখ: Date;
    গ্রাহকের_মোবাইল_নম্বর: string;
    গ্রাহকের_নাম: string;
    দুধের_পরিমাণ?: number;
    প্রতি_লিটারের_দাম?: number;
    মোট_মূল্য?: number;
    পরিশোধিত_পরিমাণ: number;
    পরিশোধ_পদ্ধতি: string;
    বকেয়া_পরিমাণ: number;
    createdAt?: Date;
    updatedAt?: Date;
}
