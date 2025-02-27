"use client";

import { IMilkProduction } from "@/types/milk.production.interface";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { Calendar } from "../ui/calendar";
import SelectOption from "../shared/Select";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const milkingOptions = [
    {
        value: "সকাল",
        label: "সকাল",
    },
    {
        value: "দুপুর",
        label: "দুপুর",
    },
    {
        value: "বিকেল",
        label: "বিকেল",
    },
    {
        value: "সন্ধ্যা",
        label: "সন্ধ্যা",
    },
];

const cattleTypeOptions = [
    {
        value: "গরু",
        label: "গরু",
    },
];

export default function AddMilkProduction() {
    const [isLoading, setIsLoading] = useState(false);
    const [totalMilk, setTotalMilk] = useState(0);
    const router = useRouter();

    const form = useForm<IMilkProduction>({
        defaultValues: {
            গবাদি_পশুর_ধরণ: "",
            দুধ_সংগ্রহের_তারিখ: new Date(),
            দুধের_পরিমাণ: 0,
            ফ্যাট_শতাংশ: 0,
            সময়: "",
            মোট_দুধের_পরিমাণ: totalMilk,
        },
    });

    const onSubmit = async (data: IMilkProduction) => {
        setIsLoading(true);

        try {
            const response = await fetch(
                "/api/milk-production/add-milk-production",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setTotalMilk(result.data.মোট_দুধের_পরিমাণ);
                toast.success("দুধ উৎপাদন তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।");
                form.reset();
            } else {
                toast.error(
                    result.message ||
                        "দুধ উৎপাদন তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।"
                );
            }
        } catch (error) {
            toast.error((error as Error).message || "Something went wrong.");
        } finally {
            setIsLoading(false);
            router.push("/milk-production");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-6">
                    <SelectOption
                        data={cattleTypeOptions}
                        form={form}
                        name="গবাদি_পশুর_ধরণ"
                        label="গবাদি পশুর ধরণ"
                        placeholder="গবাদি পশুর ধরণ নির্বাচন করুন"
                        required
                    />

                    <FormField
                        control={form.control}
                        name="মোট_দুধের_পরিমাণ"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>মোট দুধের পরিমাণ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="মোট দুধের পরিমাণ লিখুন"
                                        inputMode="numeric"
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center gap-6">
                    <FormField
                        control={form.control}
                        name="দুধ_সংগ্রহের_তারিখ"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>দুধ সংগ্রহের তারিখ</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>
                                                        তারিখ নির্বাচন করুন
                                                    </span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(date) => {
                                                if (date) {
                                                    field.onChange(date);
                                                }
                                            }}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            required
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SelectOption
                        data={milkingOptions}
                        form={form}
                        name="সময়"
                        label="দুধ দোহনের সময়"
                        placeholder="দুধ দোহনের সময় নির্বাচন করুন"
                        required
                    />
                </div>

                <div className="flex items-center gap-6">
                    <FormField
                        control={form.control}
                        name="দুধের_পরিমাণ"
                        rules={{
                            required: "দুধের পরিমাণ প্রয়োজনীয়!",
                            validate: (value) =>
                                !isNaN(Number(value)) ||
                                "শুধুমাত্র সংখ্যা লিখুন!",
                        }}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>দুধের পরিমাণ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="দুধের পরিমাণ লিখুন"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onInput={(e) => {
                                            e.currentTarget.value =
                                                e.currentTarget.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            field.onChange(e);
                                        }}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ফ্যাট_শতাংশ"
                        rules={{
                            required: "ফ্যাট শতাংশ প্রয়োজনীয়!",
                            validate: (value) => {
                                if (isNaN(Number(value)))
                                    return "শুধুমাত্র সংখ্যা লিখুন!";
                                if (value > 100)
                                    return "ফ্যাট শতাংশ সর্বোচ্চ ১০০ হতে পারে!";
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>ফ্যাট শতাংশ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ফ্যাট শতাংশ লিখুন"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onInput={(e) => {
                                            e.currentTarget.value =
                                                e.currentTarget.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            if (
                                                parseFloat(
                                                    e.currentTarget.value
                                                ) > 100
                                            ) {
                                                e.currentTarget.value = "100";
                                            }
                                            field.onChange(e);
                                        }}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button type="submit" className="btn-primary">
                        {isLoading ? (
                            <Loader2 className="size-5" />
                        ) : (
                            <Save className="size-5" />
                        )}
                        <span>সংরক্ষন করুন</span>
                    </button>
                </div>
            </form>
        </Form>
    );
}
