import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import z from 'zod';

import { DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono().get(
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
);

export default app;
