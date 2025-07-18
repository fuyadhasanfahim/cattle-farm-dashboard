import { Control, FieldValues, Path } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';

interface SelectOptionProps<T extends FieldValues> {
    data: {
        value: string;
        label: string;
    }[];
    form: {
        control: Control<T>;
    };
    name: Path<T>;
    label: string;
    placeholder: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
    className?: string;
}

export default function SelectOption<T extends FieldValues>({
    data,
    form,
    name,
    label,
    placeholder,
    disabled = false,
    required,
    onChange,
    className,
}: SelectOptionProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('w-full', className)}>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            onChange?.(value);
                        }}
                        value={field.value}
                        disabled={disabled}
                        required={required}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {data.map((option, index) => (
                                <SelectItem key={index} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
