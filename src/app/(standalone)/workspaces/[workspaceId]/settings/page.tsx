import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';

interface WorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string;
    };
}

const WorkspaceIdSettingsPage = async ({
    params,
}: WorkspaceIdSettingsPageProps) => {
    const user = await getCurrent();
    if (!user) redirect('/sign-in');

    return <div>WorkspaceIdSettingsPage: {params.workspaceId}</div>;
};

export default WorkspaceIdSettingsPage;
