'use server';

import { cookies } from 'next/headers';
import { Account, Client, Databases, Query } from 'node-appwrite';

import {
    DATABASE_ID,
    MEMBERS_COLLETION_ID,
    WORKSPACE_COLLECTION_ID,
} from '@/config';

import { AUTH_COOKIE } from '../auth/constants';

export const getWorkspaces = async () => {
    try {
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

        const workspaceIds = members.documents.map(
            (member) => member.workspaceId
        );

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACE_COLLECTION_ID,
            [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
        );

        return workspaces;
    } catch (e) {
        console.log('error', e);
        return { documents: [], total: 0 };
    }
};
