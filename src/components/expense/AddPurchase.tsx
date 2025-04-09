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
import { CalendarIcon, ShoppingBasket } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PurchaseValidationSchema } from '@/validator/expense.validation.schema';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import { ICategory, ISeller } from '@/types/expense.interface';
import { ScrollArea } from '../ui/scroll-area';

const PAYMENT_STATUSES = ['Paid', 'Pending', 'Partial'];

export default function AddPurchaseForm() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [sellers, setSellers] = useState<ISeller[]>([]);
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] =
        useState(false);
    const [isNewSellerDialogOpen, setIsNewSellerDialogOpen] = useState(false);
    const [newSeller, setNewSeller] = useState({
        name: '',
        contact: '',
        address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);

    const form = useForm<z.infer<typeof PurchaseValidationSchema>>({
        resolver: zodResolver(PurchaseValidationSchema),
        defaultValues: {
            category: '',
            itemName: '',
            quantity: '',
            pricePerItem: '',
            price: '',
            purchaseDate: new Date(),
            sellerName: '',
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

    const fetchSellers = async () => {
        try {
            const response = await fetch(`/api/expense/seller/get-sellers`);
            const { data } = await response.json();
            if (response.ok) {
                setSellers(data);
            } else {
                toast.error('Failed to fetch sellers');
            }
        } catch (error) {
            toast.error('Failed to fetch sellers');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSellers();
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

    const handleAddSeller = async () => {
        const { name, contact, address } = newSeller;

        if (!name || !contact) {
            toast.error('Name and Contact are required.');
            return;
        }

        if (sellers.some((seller) => seller.name === name)) {
            toast.error('Seller already exists.');
            return;
        }

        try {
            const response = await fetch(`/api/expense/seller/add-seller`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, contact, address }),
            });

            if (response.ok) {
                toast.success('Seller added successfully');
                setIsNewSellerDialogOpen(false);
                setNewSeller({ name: '', contact: '', address: '' });

                fetchSellers();
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

    const onSubmit = async (data: z.infer<typeof PurchaseValidationSchema>) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (balance < Number(data.paymentAmount)) {
                toast.error('Insufficient balance. Add balance first.');
                return;
            }

            const response = await fetch(`/api/expense/purchase/add-purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    price: Number(data.price),
                    paymentAmount: Number(data.paymentAmount),
                    dueAmount: Number(data.dueAmount),
                }),
            });

            if (!response.ok) throw new Error('Failed to add purchase.');

            toast.success('Purchase added successfully');
            form.reset();

            const dialogCloseButton = document.getElementById(
                'close-dialog'
            ) as HTMLElement;
            dialogCloseButton?.click();

            window.location.reload();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch('/api/balance/get-balances');

                const result = await response.json();

                if (response.ok) {
                    setBalance(
                        result.data.reduce(
                            (acc: number, val: { balance: number }) =>
                                acc + val.balance,
                            0
                        )
                    );
                } else {
                    toast.error('Failed to fetch balance');
                }
            } catch (error) {
                toast.error('Failed to fetch balance');
                console.error(error);
            }
        };

        fetchBalance();
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild id="close-dialog">
                <Button size={'lg'}>
                    <ShoppingBasket />
                    Add Purchase
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl !pr-0">
                <ScrollArea className="h-[80vh] pr-8">
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-green-500">
                            Add Purchase Form
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 mx-auto"
                        >
                            <div className="grid grid-cols-2 items-center gap-6">
                                <FormField
                                    control={form.control}
                                    name="purchaseDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col mt-2">
                                            <FormLabel>
                                                Purchase Date *
                                            </FormLabel>
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
                                                                format(
                                                                    field.value,
                                                                    'PPP'
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
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
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    '1900-01-01'
                                                                )
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
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category._id
                                                                    }
                                                                    value={
                                                                        category.name
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                        <Dialog
                                                            open={
                                                                isNewCategoryDialogOpen
                                                            }
                                                            onOpenChange={
                                                                setIsNewCategoryDialogOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full"
                                                                >
                                                                    + Add
                                                                    Category
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Add New
                                                                        Category
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
                                                                        Save
                                                                        Category
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
                                            <FormLabel>
                                                Price Per Item *
                                            </FormLabel>
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
                                    name="sellerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seller Name *</FormLabel>
                                            <div className="flex items-center space-x-2">
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Seller" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {sellers.map(
                                                            (seller) => (
                                                                <SelectItem
                                                                    key={
                                                                        seller._id
                                                                    }
                                                                    value={
                                                                        seller.name
                                                                    }
                                                                >
                                                                    {
                                                                        seller.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                        <Dialog
                                                            open={
                                                                isNewSellerDialogOpen
                                                            }
                                                            onOpenChange={
                                                                setIsNewSellerDialogOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full"
                                                                >
                                                                    + Add Seller
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Add New
                                                                        Seller
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <Label htmlFor="newSellerName">
                                                                            Name
                                                                            *
                                                                        </Label>
                                                                        <Input
                                                                            id="newSellerName"
                                                                            type="text"
                                                                            placeholder="Enter the seller name"
                                                                            value={
                                                                                newSeller.name
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setNewSeller(
                                                                                    {
                                                                                        ...newSeller,
                                                                                        name: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="newSellerContact">
                                                                            Phone
                                                                            *
                                                                        </Label>
                                                                        <Input
                                                                            id="newSellerContact"
                                                                            type="text"
                                                                            placeholder="Enter the seller phone"
                                                                            value={
                                                                                newSeller.contact
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setNewSeller(
                                                                                    {
                                                                                        ...newSeller,
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
                                                                        <Label htmlFor="newSellerAddress">
                                                                            Address
                                                                        </Label>
                                                                        <Input
                                                                            id="newSellerAddress"
                                                                            type="text"
                                                                            placeholder="Enter the address"
                                                                            value={
                                                                                newSeller.address
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setNewSeller(
                                                                                    {
                                                                                        ...newSeller,
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
                                                                            handleAddSeller
                                                                        }
                                                                    >
                                                                        Save
                                                                        Seller
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
                                            <FormLabel>
                                                Payment Status *
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Payment Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PAYMENT_STATUSES.map(
                                                        (status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {status}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                            <FormLabel>
                                                Payment Amount *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Payment amount"
                                                    readOnly={
                                                        paymentStatus ===
                                                        'Pending'
                                                    }
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
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
