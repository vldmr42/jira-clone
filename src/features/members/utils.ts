import { Databases, Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_COLLETION_ID } from '@/config';

interface GetMemberProps {
    databases: Databases;
    workspaceId: string;
    userId: string;
}

export const getMember = async ({
    databases,
    userId,
    workspaceId,
}: GetMemberProps) => {
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_COLLETION_ID,
        [Query.equal('workspaceId', workspaceId), Query.equal('userId', userId)]
    );

    return members.documents[0];
};
