export interface IMilkProduction {
    _id: string;
    দুধ_সংগ্রহের_তারিখ: Date;
    গবাদি_পশুর_ধরণ: string;
    ফ্যাট_শতাংশ: number;
    দুধের_পরিমাণ: number;
    মোট_দুধের_পরিমাণ?: number;
    সময়: string;
    createdAt: Date;
    updatedAt: Date;
}
