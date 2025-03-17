'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ICattle } from '@/types/cattle.interface';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function FatteningPage() {
    const [data, setData] = useState<ICattle[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/cattle/get-active-fattening-data`
                );
                const { data } = await response.json();

                if (response.ok) {
                    setData(data);
                } else {
                    toast.error('Failed to fetch data');
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white py-4 px-6">
                <CardTitle className="text-xl font-semibold">
                    Active Fattening Data
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2
                            className="animate-spin text-green-500"
                            size={30}
                        />
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No data available.
                    </p>
                ) : (
                    <Table className="border border-gray-300 w-full">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="text-center p-2">
                                    Serial No.
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Tag ID
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Category
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Type
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Birthdate
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Registration Date
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Fattening Status
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Stall No.
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Breed
                                </TableHead>
                                <TableHead className="text-center p-2">
                                    Gender
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map(
                                (
                                    {
                                        tagId,
                                        cattleCategory,
                                        cattleType,
                                        dateOfBirth,
                                        fatteningStatus,
                                        stallNumber,
                                        registrationDate,
                                        breed,
                                        gender,
                                    },
                                    index
                                ) => (
                                    <TableRow
                                        key={index}
                                        className="hover:bg-gray-50 transition duration-200"
                                    >
                                        <TableCell className="text-center p-3 font-medium">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {tagId}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {cattleCategory}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {cattleType}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {dateOfBirth &&
                                                format(dateOfBirth, 'PPP')}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {registrationDate &&
                                                format(registrationDate, 'PPP')}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {fatteningStatus}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {stallNumber}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {breed ? breed : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-center p-3">
                                            {gender}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
