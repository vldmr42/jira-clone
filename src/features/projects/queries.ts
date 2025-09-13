import { DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/config';
import { createSessionClient } from '@/lib/appwrite';

import { getMember } from '../members/utils';
import { Project } from './types';

interface GetProjectProps {
    projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectId
    );

    const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId,
    });

    if (!member) {
        return null;
    }

    return project;
};
