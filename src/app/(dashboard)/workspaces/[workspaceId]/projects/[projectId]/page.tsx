import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getProject } from '@/features/projects/queries';

interface ProjectIdPageProps {
    params: { projectId: string };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
    const user = await getCurrent();

    const initialValues = await getProject({
        projectId: params.projectId,
    });

    if (!user) {
        redirect('/sign-in');
    }

    return <div>{JSON.stringify(initialValues)}</div>;
};

export default ProjectIdPage;
