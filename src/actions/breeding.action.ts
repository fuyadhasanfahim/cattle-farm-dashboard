import axiosInstance from '@/lib/axiosInstance';

export async function getAllBreedings() {
    try {
        const response = await axiosInstance(
            `/api/breeding/get-breedings-without-pagination`
        );

        const { data } = await response.data;

        return data;
    } catch (error) {
        throw new Error((error as Error).message || 'Something went wrong!');
    }
}
