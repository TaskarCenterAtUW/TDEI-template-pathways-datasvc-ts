import App from './app';
import dotenv from 'dotenv';
import "reflect-metadata";
import PostsController from './controller/gtfs-flex-controller';
import { DataSource } from 'typeorm';
import { AppDataSource } from './database/data-source';
import HealthController from './controller/health-controller';
import { environment } from './environment/environment';

//Load environment variables
dotenv.config()

const PORT: number = environment.appPort;

const app = new App(
    [
        new PostsController(),
        new HealthController()
    ],
    PORT,
);

console.log("env", environment)

//Initialize the database
AppDataSource.initialize().then(async (dataSource: DataSource) => {
    console.log("Database initialized successfully !");
}).catch(error => console.log("Error setting up the database : ", error))

app.listen();

