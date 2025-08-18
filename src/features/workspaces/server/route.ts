import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';

import {
    DATABASE_ID,
    IMAGES_BUCKET_ID,
    MEMBERS_COLLETION_ID,
    WORKSPACE_COLLECTION_ID,
} from '@/config';
import { MemberRole } from '@/features/members/types';
import { sessionMiddleware } from '@/lib/session-middleware';
import { generateInviteCode } from '@/lib/utils';

import { createWorkspaceSchema } from '../schema';

const app = new Hono()
    .get('/', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_COLLETION_ID,
            [Query.equal('userId', user.$id)]
        );

        if (members.total === 0) {
            return c.json({ data: { daocuments: [], total: 0 } });
        }

        const workspaceIds = members.documents.map(
            (member) => member.workspaceId
        );

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACE_COLLECTION_ID,
            [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
        );

        return c.json({ data: workspaces });
    })
    .post(
        '/',
        zValidator('form', createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get('databases');
            const storage = c.get('storage');
            const user = c.get('user');

            const { name, image } = c.req.valid('form');

            let uploadedImageUrl: string | undefined;

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                );

                const arrayBuffer = await storage.getFileView(
                    IMAGES_BUCKET_ID,
                    file.$id
                );

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(
                    arrayBuffer
                ).toString('base64')}`;
            }

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACE_COLLECTION_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedImageUrl,
                    inviteCode: generateInviteCode(6),
                }
            );

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_COLLETION_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    workspaceId: workspace.$id,
                    role: MemberRole.ADMIN,
                }
            );

            return c.json({ data: workspace });
        }
    );

export default app;
