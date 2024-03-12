import { appEvents } from '$lib/utils/appEvents';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { test } = body;
    
    appEvents?.emit('message', test);

    return new Response();
};