import { Request } from "express";
import express from "express";
import { IController } from "./interface/IController";
import { PathwaysQueryParams } from "../model/gtfs-pathways-get-query-params";
import { FileEntity } from "nodets-ms-core/lib/core/storage";
import gtfsPathwaysService from "../service/gtfs-pathways-service";
import { BadRequest } from "../model/http/http-responses";

class GtfsPathwaysController implements IController {
    public path = '/api/v1/gtfspathways';
    public router = express.Router();
    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllGtfsPathway);
        this.router.get(`${this.path}/:id`, this.getGtfsPathwayById);
        this.router.post(this.path, this.createAGtfsPathway);
    }

    getAllGtfsPathway = async (request: Request, response: express.Response) => {
        var params: PathwaysQueryParams = new PathwaysQueryParams(JSON.parse(JSON.stringify(request.query)));

        // load gtfsPathways
        const gtfsPathways = await gtfsPathwaysService.getAllGtfsPathway(params);
        // return loaded gtfsPathways
        response.send(gtfsPathways);
    }

    getGtfsPathwayById = async (request: Request, response: express.Response) => {

        try {
            // load a gtfsPathway by a given gtfsPathway id
            let fileEntity: FileEntity = await gtfsPathwaysService.getGtfsPathwayById(request.params.id);

            response.header('Content-Type', fileEntity.mimeType);
            response.header('Content-disposition', `attachment; filename=${fileEntity.fileName}`);
            response.status(200);
            (await fileEntity.getStream()).pipe(response);
        } catch (error) {
            console.log('Error while getting the file stream');
            console.log(error);
            BadRequest(response);
        }
    }

    createAGtfsPathway = async (request: Request, response: express.Response) => {

        var newGtfsPathway = await gtfsPathwaysService.createAGtfsPathway(request.body).catch((error: any) => {
            console.log('Error saving the pathways version');
            console.log(error);
            // if gtfsPathway was not found return 404 to the client
            response.status(500);
            response.end();
            return;
        });
        // return saved gtfsPathway back
        response.send(newGtfsPathway);
    }
}

const gtfsPathwaysController = new GtfsPathwaysController();
export default gtfsPathwaysController;