'use server';

import { getCurrentUserAccount } from '@/lib/appwrite';

export const getCurrent = async () => {
    const account = await getCurrentUserAccount();

    if (!account) {
        return null;
    }

    return await account.get();
};
