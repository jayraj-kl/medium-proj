import { Hono } from 'hono';
import { rootRouter } from './routes';

// Create the main Hono app
const app = new Hono();

app.route('/api/v1/', rootRouter)


export default app;
