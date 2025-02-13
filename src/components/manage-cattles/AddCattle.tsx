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

type CattleFormValues = {
    cattleId: string;
    breed: string;
    age: string;
    weight: string;
};

export default function AddCattle({
    setOpen,
}: {
    setOpen: (isOpen: boolean) => void;
}) {
    const form = useForm<CattleFormValues>({
        defaultValues: {
            cattleId: '',
            breed: '',
            age: '',
            weight: '',
        },
    });

    const onSubmit = async (data: CattleFormValues) => {
        try {
            console.log(data);
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="space-y-4 font-notoSansBengali px-4">
            <div className="flex items-center justify-between">
                <DialogHeader>
                    <DialogTitle>গবাদি পশুর তথ্য যোগ করুন</DialogTitle>
                </DialogHeader>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-6">
                        <FormField
                            control={form.control}
                            name="cattleId"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>ট্যাগ আইডি</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর ট্যাগ আইডি লিখুন"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>রেজিষ্ট্রেশন তাং</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর রেজিষ্ট্রেশন তাং লিখুন"
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
                            name="age"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>বয়স/মাস</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর বয়স/মাস লিখুন"
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
                                    <FormLabel>স্টল নাং</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর স্টল নাং লিখুন"
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
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>ওজন/কেজি</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর ওজন/কেজি লিখুন"
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
                                    <FormLabel>গবাদিপশুর লিঙ্গ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর গবাদিপশুর লিঙ্গ লিখুন"
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
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        মোটাতাজা করন স্ট্যাটাস
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর মোটাতাজা করন স্ট্যাটাস লিখুন"
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
                                    <FormLabel>গবাদিপশুর ধরন</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="গবাদিপশুর ধরন লিখুন"
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
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>গবাদিপশুর ক্যাটাগরি</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="গবাদিপশুর ক্যাটাগরি লিখুন"
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
                                    <FormLabel>স্থানান্তর/বিক্রয়</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর স্থানান্তর/বিক্রয় লিখুন"
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
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>মৃত অবস্থা</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর মৃত অবস্থা লিখুন"
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
                                    <FormLabel>বিবরন</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর বিবরন লিখুন"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            বাতিল
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#52aa46] hover:bg-[#4a9940]"
                        >
                            সংরক্ষণ করুন
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
