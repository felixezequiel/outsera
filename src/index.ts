import { config } from 'dotenv';
import { setupApp } from './main/config/app';
import { Server } from './main/config/server';

config();

const app = setupApp();
const server = new Server(app);

server.start();

export default app;
