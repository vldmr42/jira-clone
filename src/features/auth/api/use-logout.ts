import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout.$post();

            if (!response.ok) {
                throw new Error('Failed to logout');
            }

            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current'] });
            router.refresh();
            toast.success('Logged out');
        },
        onError: () => {
            toast.error('Failed to logout');
        },
    });

    return mutation;
};
