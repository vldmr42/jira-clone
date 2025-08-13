import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';

export default async function Home() {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }

    return <div className="flex gap-6">This is Home page</div>;
}
