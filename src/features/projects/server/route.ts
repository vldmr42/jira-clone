import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import z from 'zod';

import {
    DATABASE_ID,
    IMAGES_BUCKET_ID,
    PROJECTS_COLLECTION_ID,
} from '@/config';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';

import { createProjectSchema } from '../schemas';

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator('query', z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get('user');
            const databases = c.get('databases');

            const { workspaceId } = c.req.valid('query');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const projects = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                [Query.equal('workspaceId', workspaceId)]
            );

            return c.json({ data: projects });
        }
    )
    .post(
        '/',
        sessionMiddleware,
        zValidator('form', createProjectSchema),
        async (c) => {
            const databases = c.get('databases');
            const storage = c.get('storage');
            const user = c.get('user');

            const { name, image, workspaceId } = c.req.valid('form');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized' });
            }

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

            const project = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                ID.unique(),
                {
                    name,
                    imageUrl: uploadedImageUrl,
                    workspaceId,
                }
            );

            return c.json({ data: project });
        }
    );

export default app;
