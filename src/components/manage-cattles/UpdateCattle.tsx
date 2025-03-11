// 'use client';

// import { Button } from '@/components/ui/button';
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useForm } from 'react-hook-form';
// import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Calendar } from '@/components/ui/calendar';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
// import { format } from 'date-fns';
// import { CalendarIcon } from 'lucide-react';
// import ICattleFormValues, { ICattle } from '@/types/cattle.interface';
// import { useEffect, useState } from 'react';
// import { Loader2 } from 'lucide-react';
// import { Textarea } from '../ui/textarea';

// interface UpdateCattleProps {
//     id?: string;
//     setOpen: (isOpen: boolean) => void;
// }

// const genderOptions = [
//     { value: 'পুরুষ', label: 'পুরুষ' },
//     { value: 'মহিলা', label: 'মহিলা' },
// ];

// const cattleTypeOptions = [
//     { value: 'গরু', label: 'গরু' },
//     { value: 'মহিষ', label: 'মহিষ' },
//     { value: 'ছাগল', label: 'ছাগল' },
// ];

// const categoryOptions = [
//     { value: 'ষাঁড়', label: 'ষাঁড়' },
//     { value: 'দুগ্ধ', label: 'দুগ্ধ' },
//     { value: 'মাংস', label: 'মাংস' },
//     { value: 'দুগ্ধ ও মাংস', label: 'দুগ্ধ ও মাংস' },
// ];

// const deathStatusOptions = [
//     { value: 'জীবিত', label: 'জীবিত' },
//     { value: 'মৃত', label: 'মৃত' },
// ];

// const fatteningStatusOptions = [
//     { value: 'এক্টিভ', label: 'এক্টিভ' },
//     { value: 'ইনএক্টিভ', label: 'ইনএক্টিভ' },
// ];

// const transferStatusOptions = [
//     { value: 'খামারে অবস্থিত', label: 'খামারে অবস্থিত' },
//     { value: 'বিক্রি হয়েছে', label: 'বিক্রি হয়েছে' },
// ];

// export default function UpdateCattle({ id, setOpen }: UpdateCattleProps) {
//     const [isLoading, setIsLoading] = useState(false);

//     const form = useForm<ICattle>({
//         defaultValues: {
//             ট্যাগ_আইডি: '',
//             রেজিষ্ট্রেশনের_তারিখ: new Date(),
//             জন্ম_তারিখ: undefined,
//             বয়স: '',
//             স্টল_নম্বর: '',
//             জাত: '',
//             বাবার_নাম: '',
//             বাবার_আইডি: '',
//             মায়ের_নাম: '',
//             মায়ের_আইডি: '',
//             পার্সেন্টেজ: '',
//             ওজন: '',
//             লিঙ্গ: '',
//             মোটাতাজা_করন_স্ট্যাটাস: '',
//             গবাদিপশুর_ধরন: '',
//             গবাদিপশুর_ক্যাটাগরি: '',
//             অবস্থান: '',
//             অবস্থা: '',
//             বিবরন: '',
//         },
//     });

//     const calculateAge = (birthDate: Date) => {
//         const now = new Date();
//         const diff = now.getTime() - birthDate.getTime();
//         const ageDate = new Date(diff);
//         const years = ageDate.getUTCFullYear() - 1970;
//         const months = ageDate.getUTCMonth();
//         const days = ageDate.getUTCDate() - 1;

//         if (years > 0) {
//             return `${years} বছর`;
//         } else if (months > 0) {
//             return `${months} মাস`;
//         } else {
//             return `${days} দিন`;
//         }
//     };

//     const handleBirthDateChange = (date: Date) => {
//         form.setValue('birthDate', date);
//         form.setValue('age', calculateAge(date));
//     };

//     useEffect(() => {
//         const fetchCattleData = async () => {
//             if (!id) return;

//             setIsLoading(true);
//             try {
//                 const response = await fetch(`/api/cattle/get-cattle?id=${id}`);
//                 const { cattle } = await response.json();

//                 if (cattle) {
//                     // Convert string dates to Date objects
//                     const registrationDate = cattle.registrationDate
//                         ? new Date(cattle.registrationDate)
//                         : new Date();
//                     const birthDate = cattle.birthDate
//                         ? new Date(cattle.birthDate)
//                         : undefined;

//                     // Update form with existing data
//                     form.reset({
//                         ...cattle,
//                         registrationDate,
//                         birthDate,
//                         cattleId: cattle.cattleId || '',
//                         age: cattle.age || '',
//                         stallNo: cattle.stallNo || '',
//                         weight: cattle.weight || '',
//                         gender: cattle.gender || '',
//                         fatteningStatus: cattle.fatteningStatus || '',
//                         cattleType: cattle.cattleType || '',
//                         category: cattle.category || '',
//                         transferStatus: cattle.transferStatus || '',
//                         deathStatus: cattle.deathStatus || '',
//                         description: cattle.description || '',
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching cattle data:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchCattleData();
//     }, [id, form]);

//     const onSubmit = async (data: ICattleFormValues) => {
//         setIsLoading(true);
//         try {
//             const response = await fetch(`/api/cattle/update-cattle?id=${id}`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to submit form');
//             }

//             await response.json();

//             setOpen(false);

//             form.reset();
//         } catch (error) {
//             console.error('Error submitting form:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-4 font-notoSansBengali px-4">
//             <div className="flex items-center justify-between">
//                 <DialogHeader>
//                     <DialogTitle>গবাদি পশুর তথ্য যোগ করুন</DialogTitle>
//                 </DialogHeader>
//             </div>
//             <Form {...form}>
//                 <form
//                     onSubmit={form.handleSubmit(onSubmit)}
//                     className="space-y-4"
//                 >
//                     <div className="flex items-center gap-6">
//                         <FormField
//                             control={form.control}
//                             name="cattleId"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>ট্যাগ আইডি</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="পশুর ট্যাগ আইডি লিখুন"
//                                             type="number"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="registrationDate"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>রেজিষ্ট্রেশন তাং</FormLabel>
//                                     <Popover>
//                                         <PopoverTrigger asChild>
//                                             <FormControl>
//                                                 <Button
//                                                     variant="outline"
//                                                     className={cn(
//                                                         'w-full pl-3 text-left font-normal',
//                                                         !field.value &&
//                                                             'text-muted-foreground'
//                                                     )}
//                                                 >
//                                                     {field.value ? (
//                                                         format(
//                                                             field.value,
//                                                             'PPP'
//                                                         )
//                                                     ) : (
//                                                         <span>
//                                                             তারিখ নির্বাচন করুন
//                                                         </span>
//                                                     )}
//                                                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                                 </Button>
//                                             </FormControl>
//                                         </PopoverTrigger>
//                                         <PopoverContent
//                                             className="w-auto p-0"
//                                             align="start"
//                                         >
//                                             <Calendar
//                                                 mode="single"
//                                                 selected={field.value}
//                                                 onSelect={(date) => {
//                                                     if (date) {
//                                                         field.onChange(date);
//                                                     }
//                                                 }}
//                                                 disabled={(date) =>
//                                                     date > new Date() ||
//                                                     date <
//                                                         new Date('1900-01-01')
//                                                 }
//                                                 initialFocus
//                                             />
//                                         </PopoverContent>
//                                     </Popover>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <div className="flex items-center gap-6">
//                         <FormField
//                             control={form.control}
//                             name="birthDate"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>জন্ম তারিখ</FormLabel>
//                                     <Popover>
//                                         <PopoverTrigger asChild>
//                                             <FormControl>
//                                                 <Button
//                                                     variant="outline"
//                                                     className={cn(
//                                                         'w-full pl-3 text-left font-normal',
//                                                         !field.value &&
//                                                             'text-muted-foreground'
//                                                     )}
//                                                 >
//                                                     {field.value ? (
//                                                         format(
//                                                             field.value,
//                                                             'PPP'
//                                                         )
//                                                     ) : (
//                                                         <span>
//                                                             তারিখ নির্বাচন করুন
//                                                         </span>
//                                                     )}
//                                                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                                 </Button>
//                                             </FormControl>
//                                         </PopoverTrigger>
//                                         <PopoverContent
//                                             className="w-auto p-0"
//                                             align="start"
//                                         >
//                                             <Calendar
//                                                 mode="single"
//                                                 selected={field.value}
//                                                 onSelect={(date) => {
//                                                     if (date) {
//                                                         handleBirthDateChange(
//                                                             date
//                                                         );
//                                                     }
//                                                 }}
//                                                 disabled={(date) =>
//                                                     date > new Date() ||
//                                                     date <
//                                                         new Date('1900-01-01')
//                                                 }
//                                                 initialFocus
//                                             />
//                                         </PopoverContent>
//                                     </Popover>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="age"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>বয়স/মাস</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="পশুর বয়স/মাস লিখুন"
//                                             type="text"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="flex items-center gap-6">
//                         <FormField
//                             control={form.control}
//                             name="stallNo"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>স্টল নাং</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="স্টল নাং লিখুন"
//                                             type="number"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="weight"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>ওজন/কেজি</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="পশুর ওজন/কেজি লিখুন"
//                                             type="number"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="flex items-center gap-6">
//                         <FormField
//                             control={form.control}
//                             name="gender"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>গবাদিপশুর লিঙ্গ</FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {genderOptions.map((option) => (
//                                                 <SelectItem
//                                                     key={option.value}
//                                                     value={option.value}
//                                                 >
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="fatteningStatus"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>
//                                         মোটাতাজা করন স্ট্যাটাস
//                                     </FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="নির্বাচন করুন" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {fatteningStatusOptions.map(
//                                                 (option) => (
//                                                     <SelectItem
//                                                         key={option.value}
//                                                         value={option.value}
//                                                     >
//                                                         {option.label}
//                                                     </SelectItem>
//                                                 )
//                                             )}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <div className="flex items-center gap-6">
//                         <FormField
//                             control={form.control}
//                             name="cattleType"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>গবাদিপশুর ধরন</FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="পশুর ধরন নির্বাচন করুন" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {cattleTypeOptions.map((option) => (
//                                                 <SelectItem
//                                                     key={option.value}
//                                                     value={option.value}
//                                                 >
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="category"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>গবাদিপশুর ক্যাটাগরি</FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {categoryOptions.map((option) => (
//                                                 <SelectItem
//                                                     key={option.value}
//                                                     value={option.value}
//                                                 >
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="flex items-center gap-6">
//                         <FormField
//                             control={form.control}
//                             name="deathStatus"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>মৃত অবস্থা</FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="মৃত অবস্থা নির্বাচন করুন" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {deathStatusOptions.map(
//                                                 (option) => (
//                                                     <SelectItem
//                                                         key={option.value}
//                                                         value={option.value}
//                                                     >
//                                                         {option.label}
//                                                     </SelectItem>
//                                                 )
//                                             )}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="transferStatus"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>স্থানান্তর/বিক্রয়</FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="স্থানান্তর/বিক্রয় নির্বাচন করুন" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {transferStatusOptions.map(
//                                                 (option) => (
//                                                     <SelectItem
//                                                         key={option.value}
//                                                         value={option.value}
//                                                     >
//                                                         {option.label}
//                                                     </SelectItem>
//                                                 )
//                                             )}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div>
//                         <FormField
//                             control={form.control}
//                             name="description"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <FormLabel>বিবরন</FormLabel>
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder="পশুর বিবরন লিখুন"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="flex justify-end items-center gap-2">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => setOpen(false)}
//                             disabled={isLoading}
//                         >
//                             বাতিল
//                         </Button>
//                         <Button
//                             type="submit"
//                             className="bg-green-500 hover:bg-[#4a9940]"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             ) : null}
//                             সংরক্ষণ করুন
//                         </Button>
//                     </div>
//                 </form>
//             </Form>
//         </div>
//     );
// }
