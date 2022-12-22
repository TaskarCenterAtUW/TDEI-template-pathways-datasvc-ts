import App from './app';
import dotenv from 'dotenv';
import "reflect-metadata";
import gtfsPathwaysController from './controller/gtfs-pathways-controller';
import healthController from './controller/health-controller';
import { environment } from './environment/environment';

//Load environment variables
dotenv.config()

const PORT: number = environment.appPort;

new App(
    [
        gtfsPathwaysController,
        healthController
    ],
    PORT,
).listen();


