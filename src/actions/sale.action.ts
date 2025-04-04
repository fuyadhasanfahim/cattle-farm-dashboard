import axiosInstance from '@/lib/axiosInstance';

export async function getAllSales() {
    try {
        const response = await axiosInstance.get(
            '/api/sales/get-sales-without-pagination'
        );
        const { data } = await response.data;

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
