
import express from "express";
import bodyParser from "body-parser";
import { IController } from "./controller/interface/IController";
import helmet from "helmet";
import { EventBusService } from "./service/event-bus/event-bus-service";
import { Core } from "nodets-ms-core";

class App {
    public app: express.Application;
    public port: number;
    eventBusService!: EventBusService;

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.subscribeUpload();
        this.initializeLibraries();
    }

    initializeLibraries() {
        Core.initialize();
    }

    private subscribeUpload() {
        this.eventBusService = new EventBusService();
        this.eventBusService.subscribeUpload();
    }

    private initializeMiddlewares() {
        this.app.use(helmet());
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;