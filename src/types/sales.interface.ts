export interface ISales {
    _id: string;
    বিক্রয়ের_ধরণ: string;
    বিক্রয়ের_তারিখ: Date;
    দুধের_পরিমাণ?: number;
    গবাদি_পশুর_ট্যাগ_আইডি: string;
    গবাদি_পশুর_ধরণ: string;
    প্রতি_লিটারের_দাম?: number;
    মোট_মূল্য?: number;
    বিক্রয়_মূল্য?: number;
    createdAt: Date;
}
