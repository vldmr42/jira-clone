import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout.$post();
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current'] });
            router.refresh();
            // window.location.reload();
        },
    });

    return mutation;
};
