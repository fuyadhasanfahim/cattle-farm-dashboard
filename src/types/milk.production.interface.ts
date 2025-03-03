export interface IMilkProduction {
    _id?: string;
    দুধ_সংগ্রহের_তারিখ: Date;
    গবাদি_পশুর_ট্যাগ_আইডি: string;
    গবাদি_পশুর_ধরণ: string;
    মোট_দুধের_পরিমাণ: string;
    বিক্রি_যোগ্য_দুধের_পরিমাণ: string;
    খাওয়ার_জন্য_দুধের_পরিমাণ: string;
    ফ্যাট_শতাংশ?: string;
    সময়: string;
}
