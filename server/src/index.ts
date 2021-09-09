import * as dotenv from 'dotenv';
dotenv.config();
import { startServer } from './server';

const { IP, PORT } = process.env;

startServer(IP as string, parseInt(PORT as string));
