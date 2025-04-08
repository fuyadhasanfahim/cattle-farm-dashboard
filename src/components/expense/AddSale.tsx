'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import { IBuyer, ICategory } from '@/types/expense.interface';
import { SaleValidationSchema } from '@/validator/expense.validation.schema';

const PAYMENT_STATUSES = ['Paid', 'Pending', 'Partial'];

export default function AddSale() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [buyers, setBuyers] = useState<IBuyer[]>([]);
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] =
        useState<boolean>(false);
    const [isNewBuyerDialogOpen, setIsNewBuyerDialogOpen] =
        useState<boolean>(false);
    const [newBuyer, setNewBuyer] = useState<IBuyer>({
        name: '',
        contact: '',
        address: '',
    });

    const form = useForm<z.infer<typeof SaleValidationSchema>>({
        resolver: zodResolver(SaleValidationSchema),
        defaultValues: {
            category: '',
            itemName: '',
            quantity: '',
            pricePerItem: '',
            price: '',
            salesDate: new Date(),
            buyerName: '',
            paymentStatus: '',
            paymentAmount: '',
            dueAmount: '',
            notes: '',
        },
    });

    const fetchAddCategories = async () => {
        try {
            const response = await fetch(
                `/api/expense/category/get-categories`
            );
            const { data } = await response.json();

            if (response.ok) {
                setCategories(data);
            }
        } catch (error) {
            toast.error('Failed to fetch categories');
            console.error(error);
        }
    };

    const fetchBuyers = async () => {
        try {
            const response = await fetch(`/api/expense/buyer/get-buyers`);
            const { data } = await response.json();
            if (response.ok) {
                setBuyers(data);
            } else {
                toast.error('Failed to fetch buyers');
            }
        } catch (error) {
            toast.error('Failed to fetch buyers');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    useEffect(() => {
        fetchAddCategories();
    }, []);

    const handleAddCategory = async (categoryName: string) => {
        if (
            categoryName &&
            !categories.some((category) => category.name === categoryName)
        ) {
            try {
                const response = await fetch(
                    `/api/expense/category/add-category`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: categoryName }),
                    }
                );

                if (response.ok) {
                    toast.success('Category added successfully');
                    setIsNewCategoryDialogOpen(false);

                    fetchAddCategories();
                } else {
                    toast.error('Failed to add category');
                }
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Failed to add category.'
                );
            }
        }
    };

    const handleAddBuyer = async () => {
        const { name, contact, address } = newBuyer;

        if (!name || !contact) {
            toast.error('Name and Contact are required.');
            return;
        }

        if (buyers.some((seller) => seller.name === name)) {
            toast.error('Seller already exists.');
            return;
        }

        try {
            const response = await fetch(`/api/expense/buyer/add-buyer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, contact, address }),
            });

            if (response.ok) {
                toast.success('Seller added successfully');
                setIsNewBuyerDialogOpen(false);
                setNewBuyer({ name: '', contact: '', address: '' });

                fetchBuyers();
            } else {
                toast.error('Failed to add seller');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Failed to add seller.');
        }
    };

    const quantity = form.watch('quantity');
    const pricePerItem = form.watch('pricePerItem');
    const paymentStatus = form.watch('paymentStatus');
    const paymentAmount = form.watch('paymentAmount');

    useEffect(() => {
        const calculatedPrice = (
            Number(quantity) * Number(pricePerItem)
        ).toString();
        form.setValue('price', calculatedPrice);

        if (paymentStatus === 'Paid') {
            form.setValue('paymentAmount', calculatedPrice);
            form.setValue('dueAmount', '0');
        } else if (paymentStatus === 'Pending') {
            form.setValue('paymentAmount', '0');
            form.setValue('dueAmount', calculatedPrice);
        } else {
            const calculatedDue = (
                Number(calculatedPrice) - Number(paymentAmount)
            ).toString();
            form.setValue('dueAmount', calculatedDue);
        }
    }, [quantity, pricePerItem, paymentAmount, paymentStatus, form]);

    const onSubmit = async (data: z.infer<typeof SaleValidationSchema>) => {
        try {
            const response = await fetch(`/api/expense/sale/add-sale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: data.category,
                    itemName: data.itemName,
                    quantity: data.quantity,
                    pricePerItem: data.pricePerItem
                        ? Number(data.pricePerItem)
                        : undefined,
                    price: Number(data.price),
                    salesDate: new Date(data.salesDate).toISOString(),
                    buyerName: data.buyerName,
                    paymentStatus: data.paymentStatus,
                    paymentAmount: Number(data.paymentAmount),
                    dueAmount: Number(data.dueAmount) || 0,
                    notes: data.notes || '',
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Purchase added successfully');

                form.reset();
            } else {
                toast.error(result.message || 'Failed to add purchase');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Failed to add purchase.');
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mx-auto"
            >
                <div className="grid grid-cols-2 items-center gap-6">
                    <FormField
                        control={form.control}
                        name="salesDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                                <FormLabel>Sales Date *</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
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
                                            onSelect={field.onChange}
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
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category._id}
                                                    value={category.name}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                            <Dialog
                                                open={isNewCategoryDialogOpen}
                                                onOpenChange={
                                                    setIsNewCategoryDialogOpen
                                                }
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        + Add Category
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Add New Category
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div>
                                                        <Label
                                                            htmlFor="newCategory"
                                                            className="text-right"
                                                        >
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id="newCategory"
                                                            type="text"
                                                            className="col-span-3"
                                                            placeholder="Enter the new category"
                                                        />

                                                        <Button
                                                            type="button"
                                                            className="mt-4 w-full"
                                                            onClick={() => {
                                                                const input =
                                                                    document.getElementById(
                                                                        'newCategory'
                                                                    ) as HTMLInputElement;
                                                                handleAddCategory(
                                                                    input.value
                                                                );
                                                            }}
                                                        >
                                                            Save Category
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="itemName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter item name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Quantity"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pricePerItem"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price Per Item *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Price per item"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Total price"
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="buyerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buyer Name *</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Seller" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {buyers.map((seller) => (
                                                <SelectItem
                                                    key={seller._id}
                                                    value={seller.name}
                                                >
                                                    {seller.name}
                                                </SelectItem>
                                            ))}
                                            <Dialog
                                                open={isNewBuyerDialogOpen}
                                                onOpenChange={
                                                    setIsNewBuyerDialogOpen
                                                }
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        + Add Buyer
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Add New Seller
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="newBuyerName">
                                                                Name *
                                                            </Label>
                                                            <Input
                                                                id="newBuyerName"
                                                                type="text"
                                                                placeholder="Enter the seller name"
                                                                value={
                                                                    newBuyer.name
                                                                }
                                                                onChange={(e) =>
                                                                    setNewBuyer(
                                                                        {
                                                                            ...newBuyer,
                                                                            name: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="newBuyerContact">
                                                                Phone *
                                                            </Label>
                                                            <Input
                                                                id="newBuyerContact"
                                                                type="text"
                                                                placeholder="Enter the seller phone"
                                                                value={
                                                                    newBuyer.contact
                                                                }
                                                                onChange={(e) =>
                                                                    setNewBuyer(
                                                                        {
                                                                            ...newBuyer,
                                                                            contact:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="newBuyerAddress">
                                                                Address
                                                            </Label>
                                                            <Input
                                                                id="newBuyerAddress"
                                                                type="text"
                                                                placeholder="Enter the address"
                                                                value={
                                                                    newBuyer.address
                                                                }
                                                                onChange={(e) =>
                                                                    setNewBuyer(
                                                                        {
                                                                            ...newBuyer,
                                                                            address:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            className="w-full mt-2"
                                                            onClick={
                                                                handleAddBuyer
                                                            }
                                                        >
                                                            Save Buyer
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Status *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Payment Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PAYMENT_STATUSES.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Amount *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Payment amount"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Due Amount *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Due amount"
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Additional notes"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting
                        ? 'Submitting...'
                        : 'Submit Purchase'}
                </Button>
            </form>
        </Form>
    );
}
