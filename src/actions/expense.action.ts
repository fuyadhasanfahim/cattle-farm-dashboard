'use server';

import axiosInstance from '@/lib/axiosInstance';

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get(
            `/api/expense/category/get-categories`
        );

        return response.data.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
