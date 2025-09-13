'use server';

import { cookies } from 'next/headers';
import { Account, Client, Databases, Query } from 'node-appwrite';

import {
    DATABASE_ID,
    MEMBERS_COLLETION_ID,
    WORKSPACE_COLLECTION_ID,
} from '@/config';
import { createSessionClient } from '@/lib/appwrite';

import { AUTH_COOKIE } from '../auth/constants';
import { getMember } from '../members/utils';
import { Workspace } from './types';

export const getWorkspaces = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);
    if (!session) {
        return null;
    }
    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_COLLETION_ID,
        [Query.equal('userId', user.$id)]
    );

    if (members.total === 0) {
        return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACE_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
    );

    return workspaces;
};

interface GetWorkspaceProps {
    workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
    });

    if (!member) {
        throw new Error('Unauthorized');
    }

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_COLLECTION_ID,
        workspaceId
    );

    return workspace;
};

interface GetWorkspaceInfoProps {
    workspaceId: string;
}

export const getWorkspaceInfo = async ({
    workspaceId,
}: GetWorkspaceInfoProps) => {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_COLLECTION_ID,
        workspaceId
    );

    return {
        name: workspace.name,
    };
};
