import {
    ChevronLeft,
    ChevronRight,
    Edit,
    EyeOff,
    Search,
    Trash2,
} from 'lucide-react';
import { JSX } from 'react';

const data = [
    'ক্রমিক নং',
    'ট্যাগ আইডি',
    'রেজিষ্ট্রেশন তাং',
    'বয়স/মাস',
    'স্টল নাং',
    'ওজন/কেজি',
    'গবাদিপশুর লিঙ্গ',
    'মোটাতাজা করন স্ট্যাটাস',
    'গবাদিপশুর ধরন',
    'গবাদিপশুর ক্যাটাগরি',
    'স্থানান্তর/বিক্রয়',
    'মৃত অবস্থা',
    'বিবরন',
    'অ্যাকশান',
];

type TableRow = {
    [key: string]: string | JSX.Element;
};

const tableData: TableRow[] = [
    {
        'ক্রমিক নং': '০১',
        'ট্যাগ আইডি': '০০১',
        'রেজিষ্ট্রেশন তাং': '২৫/০১/২০২৫',
        'বয়স/মাস': '০৪',
        'স্টল নাং': '০১',
        'ওজন/কেজি': '৮০',
        'গবাদিপশুর লিঙ্গ': 'পুরুষ',
        'মোটাতাজা করন স্ট্যাটাস': 'এক্টিভ',
        'গবাদিপশুর ধরন': 'গরু',
        'গবাদিপশুর ক্যাটাগরি': 'ষাঁড়',
        'স্থানান্তর/বিক্রয়': 'খামারে অবস্থিত',
        'মৃত অবস্থা': 'জীবিত',
        বিবরন: <EyeOff className="text-muted-foreground size-4" />,
        অ্যাকশান: (
            <div className="flex space-x-2">
                <Edit className="cursor-pointer size-4" />
                <Trash2 className="cursor-pointer size-4" />
            </div>
        ),
    },
    {
        'ক্রমিক নং': '০১',
        'ট্যাগ আইডি': '০০১',
        'রেজিষ্ট্রেশন তাং': '২৫/০১/২০২৫',
        'বয়স/মাস': '০৪',
        'স্টল নাং': '০১',
        'ওজন/কেজি': '৮০',
        'গবাদিপশুর লিঙ্গ': 'পুরুষ',
        'মোটাতাজা করন স্ট্যাটাস': 'এক্টিভ',
        'গবাদিপশুর ধরন': 'গরু',
        'গবাদিপশুর ক্যাটাগরি': 'ষাঁড়',
        'স্থানান্তর/বিক্রয়': 'খামারে অবস্থিত',
        'মৃত অবস্থা': 'জীবিত',
        বিবরন: <EyeOff className="text-muted-foreground size-4" />,
        অ্যাকশান: (
            <div className="flex space-x-2">
                <Edit className="cursor-pointer size-4" />
                <Trash2 className="cursor-pointer size-4" />
            </div>
        ),
    },
    {
        'ক্রমিক নং': '০১',
        'ট্যাগ আইডি': '০০১',
        'রেজিষ্ট্রেশন তাং': '২৫/০১/২০২৫',
        'বয়স/মাস': '০৪',
        'স্টল নাং': '০১',
        'ওজন/কেজি': '৮০',
        'গবাদিপশুর লিঙ্গ': 'পুরুষ',
        'মোটাতাজা করন স্ট্যাটাস': 'এক্টিভ',
        'গবাদিপশুর ধরন': 'গরু',
        'গবাদিপশুর ক্যাটাগরি': 'ষাঁড়',
        'স্থানান্তর/বিক্রয়': 'খামারে অবস্থিত',
        'মৃত অবস্থা': 'জীবিত',
        বিবরন: <EyeOff className="text-muted-foreground size-4" />,
        অ্যাকশান: (
            <div className="flex space-x-2">
                <Edit className="cursor-pointer size-4" />
                <Trash2 className="cursor-pointer size-4" />
            </div>
        ),
    },
    {
        'ক্রমিক নং': '০১',
        'ট্যাগ আইডি': '০০১',
        'রেজিষ্ট্রেশন তাং': '২৫/০১/২০২৫',
        'বয়স/মাস': '০৪',
        'স্টল নাং': '০১',
        'ওজন/কেজি': '৮০',
        'গবাদিপশুর লিঙ্গ': 'পুরুষ',
        'মোটাতাজা করন স্ট্যাটাস': 'এক্টিভ',
        'গবাদিপশুর ধরন': 'গরু',
        'গবাদিপশুর ক্যাটাগরি': 'ষাঁড়',
        'স্থানান্তর/বিক্রয়': 'খামারে অবস্থিত',
        'মৃত অবস্থা': 'জীবিত',
        বিবরন: <EyeOff className="text-muted-foreground size-4" />,
        অ্যাকশান: (
            <div className="flex space-x-2">
                <Edit className="cursor-pointer size-4" />
                <Trash2 className="cursor-pointer size-4" />
            </div>
        ),
    },
];

export default function DataTable() {
    return (
        <section className="space-y-6">
            <form className="relative w-[433px] h-[45px]">
                <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-muted-foreground size-4" />
                <input
                    type="search"
                    placeholder="অনুসন্ধান করুণ"
                    className="w-full h-full pl-10 pr-3 bg-white rounded-lg focus:border-[#52aa46] placeholder:text-muted-foreground outline outline-1 outline-[#52aa46] focus:outline-2"
                />
            </form>

            <div>
                <table className="w-full bg-[#52aa46] rounded-t-lg">
                    <thead>
                        <tr>
                            {data.map((header, index) => (
                                <th
                                    key={index}
                                    className="text-white font-normal font-['FN Shorif Borsha Bijoy52'] border border-dashed p-3"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="bg-white">
                                {data.map((header, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="p-3 border border-dashed"
                                    >
                                        {row[header] || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="h-8 justify-start items-center gap-2 inline-flex">
                <div className="px-4 py-2 rounded-lg border border-[#666666] justify-center items-center gap-2 flex">
                    <ChevronLeft className="size-4" />
                    <span className="text-[#666666] font-normal font-['FN Shorif Borsha Bijoy52']">
                        পূর্ববর্তী
                    </span>
                </div>
                <div className="p-3 bg-[#52aa46] rounded-lg justify-center items-center gap-2 flex">
                    <div className="text-white text-xs font-normal font-['FN Shorif Borsha Bijoy52']">
                        ০১
                    </div>
                </div>
                <div className="p-3 rounded-lg border border-[#666666] justify-center items-center gap-2 flex">
                    <div className="text-[#666666] text-xs font-normal font-['FN Shorif Borsha Bijoy52']">
                        ০২
                    </div>
                </div>
                <div className="px-4 py-2 rounded-lg border border-[#666666] justify-center items-center gap-2 flex">
                    <span className="text-[#666666] font-normal font-['FN Shorif Borsha Bijoy52']">
                        পরবর্তী
                    </span>
                    <ChevronRight className="size-4" />
                </div>
            </div>
        </section>
    );
}
