'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { ICattle } from '@/types/cattle.interface';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import SelectOption from '../shared/Select';
import { useRouter } from 'next/navigation';

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

const cattleTypeOptions = [
    { value: 'Cow', label: 'Cow' },
    { value: 'Buffalo', label: 'Buffalo' },
    { value: 'Goat', label: 'Goat' },
];

const categoryOptions = [
    { value: 'Milk', label: 'Milk' },
    { value: 'Meat', label: 'Meat' },
    { value: 'Milk & Meat', label: 'Milk & Meat' },
];

const deathStatusOptions = [
    { value: 'Alive', label: 'Alive' },
    { value: 'Dead', label: 'Dead' },
];

const fatteningStatusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

const MilkingAndDryStatusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

const transferStatusOptions = [
    { value: 'In farm', label: 'In farm' },
    { value: 'Sold', label: 'Sold' },
];

export default function AddCattle({
    setOpen,
}: {
    setOpen: (isOpen: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<ICattle>({
        defaultValues: {
            tagId: '',
            registrationDate: new Date(),
            dateOfBirth: undefined,
            age: '',
            stallNumber: '',
            breed: '',
            fatherName: '',
            fatherId: '',
            motherName: '',
            motherId: '',
            percentage: '',
            weight: '',
            gender: '',
            MilkingAndDryStatus: '',
            fatteningStatus: '',
            cattleType: '',
            cattleCategory: '',
            location: '',
            status: '',
            description: '',
            profileImage: '',
        },
    });

    const calculateAge = (birthDate: Date) => {
        const now = new Date();
        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const ageParts: string[] = [];
        if (years > 0) ageParts.push(`${years} years`);
        if (months > 0) ageParts.push(`${months} months`);
        if (days > 0) ageParts.push(`${days} days`);

        return ageParts.join(' ');
    };

    const handleBirthDateChange = (date: Date) => {
        form.setValue('dateOfBirth', date);
        form.setValue('age', calculateAge(date));
    };

    const onSubmit = async (data: ICattle) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/cattle/add-cattle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Something went wrong submitting the form!');
            }

            await response.json();
            toast.success('Successfully submitted the form.');

            router.refresh();
            form.reset();
            setOpen(false);
        } catch (error) {
            toast.error(
                (error as Error).message ||
                    'Something went wrong submitting the form!'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4  px-4">
            <div className="flex items-center justify-between">
                <DialogHeader>
                    <DialogTitle>Add Cattle Information</DialogTitle>
                </DialogHeader>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-6"
                >
                    <FormField
                        control={form.control}
                        name="tagId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Tag ID *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Cattle tag ID"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="registrationDate"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Registrations Date *</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Select the Date</span>
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
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Select Birthdate *</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Select the date</span>
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
                                                    handleBirthDateChange(date);
                                                }
                                            }}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Age *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Select birthdate for this"
                                        type="text"
                                        {...field}
                                        readOnly
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stallNumber"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Stall Number *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 25"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Weight (KG) *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 650"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SelectOption
                        data={genderOptions}
                        form={form}
                        label="Select Gender *"
                        name="gender"
                        placeholder="eg: Male"
                    />

                    <SelectOption
                        data={fatteningStatusOptions}
                        form={form}
                        name="fatteningStatus"
                        label="Select Fattening Status *"
                        placeholder="eg: Inactive"
                    />

                    <SelectOption
                        data={MilkingAndDryStatusOptions}
                        form={form}
                        name="MilkingAndDryStatus"
                        label="Select milking and dry Status *"
                        placeholder="eg: Inactive"
                    />

                    <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Breed (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: Holstein Friesian"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    {`Father's Name (Optional)`}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: xyz"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fatherId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{`Fathers ID (Optional)`}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 1200"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="motherName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{`Mothers Name (Optional)`}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: zyx"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="motherId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{`Mothers ID (Optional)`}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 1300"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="percentage"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Percentage (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 50% holstein & 50% friesian"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>ProfileImage *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Upload the image in cloudinary and pest the link here"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SelectOption
                        data={cattleTypeOptions}
                        form={form}
                        name="cattleType"
                        label="Cattle Type *"
                        placeholder="eg: Cow"
                    />

                    <SelectOption
                        data={categoryOptions}
                        form={form}
                        name="cattleCategory"
                        label="Cattle Category *"
                        placeholder="eg: Milk"
                    />

                    <SelectOption
                        data={deathStatusOptions}
                        form={form}
                        name="status"
                        label="Status *"
                        placeholder="eg: Dead"
                    />

                    <SelectOption
                        data={transferStatusOptions}
                        form={form}
                        name="location"
                        label="Location *"
                        placeholder="eg: Sold"
                    />

                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        Description (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="eg: Lorem ipsum dolor sit amet."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end items-center gap-2">
                        <div className="flex items-center gap-6">
                            <Button
                                onClick={() => router.back()}
                                className="w-full"
                                type="button"
                                variant={'outline'}
                            >
                                <ArrowLeft className="size-5" />
                                <span>Back</span>
                            </Button>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Update
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
