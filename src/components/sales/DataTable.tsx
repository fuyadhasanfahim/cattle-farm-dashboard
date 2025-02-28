"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { format } from "date-fns";

interface ISales {
    _id: string;
    createdAt: Date;
    বিক্রয়ের_ধরণ: string;
    বিক্রয়ের_তারিখ: Date;
    গ্রাহকের_মোবাইল_নম্বর: string;
    গ্রাহকের_নাম: string;
    দুধের_পরিমাণ: string;
    প্রতি_লিটারের_দাম: string;
    মোট_মূল্য: string;
    পরিশোধিত_পরিমাণ: string;
    পরিশোধ_পদ্ধতি: string;
    বকেয়া_পরিমাণ: string;
}

export default function DataTable() {
    const [data, setData] = useState<ISales[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/sales/get-sales`);
                const { data } = await response.json();

                setData(data);
            } catch (error) {
                console.error("Error fetching milk sales data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLocationChange = (id: string) => {
        console.log("View details for ID:", id);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md my-10">
            <h1 className="text-2xl font-bold mb-6">বিক্রয় ডেটা</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-500">
                    <tr>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            বিক্রয় আইডি
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            বিক্রয়ের ধরণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            দুধের পরিমাণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            বিক্রয়ের তারিখ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            তৈরি হওয়ার তারিখ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            অ্যাকশন
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">
                                লোড হচ্ছে...
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item._id}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item._id}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.বিক্রয়ের_ধরণ}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.দুধের_পরিমাণ} লিটার
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.বিক্রয়ের_তারিখ
                                        ? format(
                                              new Date(item.বিক্রয়ের_তারিখ),
                                              "dd-MMMM-yyyy"
                                          )
                                        : "N/A"}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.createdAt
                                        ? format(
                                              new Date(item.createdAt),
                                              "dd-MMMM-yyyy"
                                          )
                                        : "N/A"}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    <div className="w-full flex items-center justify-center">
                                        <Eye
                                            className="size-5 hover:text-yellow-500 hover:cursor-pointer"
                                            onClick={() =>
                                                handleLocationChange(item._id)
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
