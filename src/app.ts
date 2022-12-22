
import express from "express";
import bodyParser from "body-parser";
import { IController } from "./controller/interface/IController";
import helmet from "helmet";
import { Core } from "nodets-ms-core";
import eventBusService from "./service/event-bus/event-bus-service";
import cors from "cors";
import { unhandledExceptionAndRejectionHandler } from "./middleware/unhandled-exception-rejection-handler";
import { errorHandler } from "./middleware/error-handler-middleware";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;
        //First middleware to be registered: after express init
        unhandledExceptionAndRejectionHandler();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.subscribeUpload();
        this.initializeLibraries();

        //Last middleware to be registered: error handler. 
        this.app.use(errorHandler);
    }

    initializeLibraries() {
        Core.initialize();
    }

    private subscribeUpload() {
        eventBusService.subscribeUpload();
    }

    private initializeMiddlewares() {
        this.app.use(helmet());
        this.app.use(bodyParser.json());
        this.app.use(cors());
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