'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { ITreatment } from '@/types/treatment.interface';

const treatments: ITreatment[] = [
    {
        cattleId: 'C001',
        treatmentType: 'Vaccination',
        medicineName: 'BoviShield',
        treatmentDate: new Date('2024-03-01'),
        nextDueDate: new Date('2024-09-01'),
        vaccinationInterval: 6,
        dewormingCount: 0,
        vaccinationCount: 1,
        generalCount: 0,
    },
    {
        cattleId: 'C002',
        treatmentType: 'Deworming',
        medicineName: 'Ivermectin',
        treatmentDate: new Date('2024-02-15'),
        nextDueDate: new Date('2024-05-15'),
        vaccinationInterval: undefined,
        dewormingCount: 1,
        vaccinationCount: 0,
        generalCount: 0,
    },
    {
        cattleId: 'C003',
        treatmentType: 'General',
        medicineName: 'Antibiotics',
        treatmentDate: new Date('2024-04-10'),
        nextDueDate: undefined,
        vaccinationInterval: undefined,
        dewormingCount: 0,
        vaccinationCount: 0,
        generalCount: 1,
    },
];

export default function TreatmentTable() {
    return (
        <Table className="bg-white font-inter my-10">
            <TableCaption>List of Cattle Treatments</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Cattle ID</TableHead>
                    <TableHead className="text-center">
                        Treatment Type
                    </TableHead>
                    <TableHead className="text-center">Medicine Name</TableHead>
                    <TableHead className="text-center">
                        Treatment Date
                    </TableHead>
                    <TableHead className="text-center">Next Due Date</TableHead>
                    <TableHead className="text-center">
                        Vaccination Interval
                    </TableHead>
                    <TableHead className="text-center">
                        Deworming Count
                    </TableHead>
                    <TableHead className="text-center">
                        Vaccination Count
                    </TableHead>
                    <TableHead className="text-center">General Count</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {treatments.map((treatment, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                        <TableCell className="font-medium text-center">
                            {treatment.cattleId}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.treatmentType}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.medicineName}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.treatmentDate.toDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.nextDueDate
                                ? treatment.nextDueDate.toDateString()
                                : 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.vaccinationInterval || 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.dewormingCount}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.vaccinationCount}
                        </TableCell>
                        <TableCell className="text-center">
                            {treatment.generalCount}
                        </TableCell>
                        <TableCell className="text-center">View</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell
                        colSpan={10}
                        className="text-center font-semibold"
                    >
                        End of Records
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
