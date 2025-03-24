import axiosInstance from '@/lib/axiosInstance';

export async function getAllCattails() {
    try {
        const response = await axiosInstance(
            `/api/cattle/get-cattails-without-pagination`
        );
        const { data } = await response.data;

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
