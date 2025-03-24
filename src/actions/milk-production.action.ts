'use server';

import axiosInstance from '@/lib/axiosInstance';

export async function getAllMilkProductions() {
    try {
        const response = await axiosInstance.get(
            '/api/milk-production/get-milk-production-data-without-pagination'
        );
        const result = await response.data;

        return result.data;
    } catch (error) {
        throw new Error((error as Error).message || 'Something went wrong!');
    }
}
