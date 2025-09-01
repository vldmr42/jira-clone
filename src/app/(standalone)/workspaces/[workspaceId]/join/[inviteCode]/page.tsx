import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getWorkspaceInfo } from '@/features/workspaces/queries';

interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string;
    };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }

    const workspace = await getWorkspaceInfo({
        workspaceId: params.workspaceId,
    });

    return <div>{JSON.stringify(workspace)}</div>;
};

export default WorkspaceIdJoinPage;
