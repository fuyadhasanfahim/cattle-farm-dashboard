'use server';

export async function getTotalBalance() {
    try {
        const response = await fetch(
            `${process.env.DOMAIN!}/api/balance/get-balances`
        );

        const result = await response.json();

        if (response.ok) {
            const balance = result.data.reduce(
                (acc: number, val: { balance: number }) => acc + val.balance,
                0
            );

            const earnings = result.data.reduce(
                (acc: number, val: { earning: number }) => acc + val.earning,
                0
            );

            return balance + earnings;
        } else {
            throw new Error(
                'Something went wrong, getting total balance. Try again later.'
            );
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getBalance() {
    try {
        const response = await fetch(
            `${process.env.DOMAIN!}/api/balance/get-balances`
        );

        const result = await response.json();

        if (response.ok) {
            return result.data.reduce(
                (acc: number, val: { balance: number }) => acc + val.balance,
                0
            );
        } else {
            throw new Error(
                'Something went wrong, getting balance. Try again later.'
            );
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getExpense() {
    try {
        const response = await fetch(
            `${process.env.DOMAIN!}/api/balance/get-balances`
        );

        const result = await response.json();

        if (response.ok) {
            return result.data.reduce(
                (acc: number, val: { expense: number }) => acc + val.expense,
                0
            );
        } else {
            throw new Error(
                'Something went wrong, getting expense. Try again later.'
            );
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getEarnings() {
    try {
        const response = await fetch(
            `${process.env.DOMAIN!}/api/balance/get-balances`
        );

        const result = await response.json();

        if (response.ok) {
            return result.data.reduce(
                (acc: number, val: { earning: number }) => acc + val.earning,
                0
            );
        } else {
            throw new Error(
                'Something went wrong, getting earnings. Try again later.'
            );
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function getDue() {
    try {
        const response = await fetch(
            `${process.env.DOMAIN!}/api/balance/get-balances`
        );

        const result = await response.json();

        if (response.ok) {
            return result.data.reduce(
                (acc: number, val: { due: number }) => acc + val.due,
                0
            );
        } else {
            throw new Error(
                'Something went wrong, getting due. Try again later.'
            );
        }
    } catch (error) {
        throw new Error((error as Error).message);
    }
}
