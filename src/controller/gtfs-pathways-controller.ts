import { Request } from "express";
import express from "express";
import { IController } from "./interface/IController";
import { GtfsPathwaysService } from "../service/gtfs-pathways-service";
import { IGtfsPathwaysService } from "../service/gtfs-pathways-service-interface";

class GtfsPathwaysController implements IController {
    public path = '/gtfspathways';
    public router = express.Router();
    private gtfsPathwaysService!: IGtfsPathwaysService;
    constructor() {
        this.intializeRoutes();
        this.gtfsPathwaysService = new GtfsPathwaysService();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllGtfsPathway);
        this.router.get(`${this.path}\:id`, this.getGtfsPathwayById);
        this.router.post(this.path, this.createAGtfsPathway);
    }

    getAllGtfsPathway = async (request: Request, response: express.Response) => {
        // load gtfsPathways
        const gtfsPathways = await this.gtfsPathwaysService.getAllGtfsPathway();

        // return loaded gtfsPathways
        response.send(gtfsPathways);
    }

    getGtfsPathwayById = async (request: Request, response: express.Response) => {

        // load a gtfsPathway by a given gtfsPathway id
        const gtfsPathway = await this.gtfsPathwaysService.getGtfsPathwayById(request.params.id);

        // if gtfsPathway was not found return 404 to the client
        if (!gtfsPathway) {
            response.status(404);
            response.end();
            return;
        }

        // return loaded gtfsPathway
        response.send(gtfsPathway);
    }

    createAGtfsPathway = async (request: Request, response: express.Response) => {
        var newGtfsPathway = await this.gtfsPathwaysService.createAGtfsPathway(request.body);

        // return saved gtfsPathway back
        response.send(newGtfsPathway);
    }
}

export default GtfsPathwaysController;