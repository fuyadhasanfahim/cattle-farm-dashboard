import { Popover } from '@radix-ui/react-popover';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { FieldValues } from 'react-hook-form';

interface MyCalenderProps {
    form: FieldValues;
    label: string;
    placeholder?: string;
    name: string;
    disabled?: boolean;
}

export default function MyCalender({
    form,
    label,
    placeholder,
    name,
    disabled = false,
}: MyCalenderProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span>
                                            {placeholder
                                                ? placeholder
                                                : 'Select a date'}
                                        </span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => field.onChange(date)}
                                disabled={
                                    disabled
                                        ? true
                                        : (date) =>
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
    );
}
