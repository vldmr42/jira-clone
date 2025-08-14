import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID } from 'node-appwrite';

import { DATABASE_ID, WORKSPACE_COLLECTION_ID } from '@/config';
import { sessionMiddleware } from '@/lib/session-middleware';

import { createWorkspaceSchema } from '../schema';

const app = new Hono().post(
    '/',
    zValidator('json', createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');

        const { name } = c.req.valid('json');

        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACE_COLLECTION_ID,
            ID.unique(),
            {
                name,
                userId: user.$id,
            }
        );

        return c.json({ data: workspace });
    }
);

export default app;
