import { Request } from "express";
import express from "express";
import { IController } from "./interface/IController";
import { AppDataSource } from "../database/data-source";
import { FlexVersions } from "../database/entity/flex-version-entity";

class GtfsFlexController implements IController {
    public path = '/gtfsflex';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllGtfsFlex);
        this.router.get(`${this.path}\:id`, this.getGtfsFlexById);
        this.router.post(this.path, this.createAGtfsFlex);
    }

    getAllGtfsFlex = async (request: Request, response: express.Response) => {
        // get a gtfsFlex repository to perform operations with gtfsFlex
        const gtfsFlexRepository = AppDataSource.getRepository(FlexVersions);

        // load gtfsFlexs
        const gtfsFlexs = await gtfsFlexRepository.find();

        // return loaded gtfsFlexs
        response.send(gtfsFlexs);
    }

    getGtfsFlexById = async (request: Request, response: express.Response) => {
        // get a gtfsFlex repository to perform operations with gtfsFlex
        const gtfsFlexRepository = AppDataSource.getRepository(FlexVersions);

        // load a gtfsFlex by a given gtfsFlex id
        const gtfsFlex = await gtfsFlexRepository.findOneBy({ id: Number.parseInt(request.params.id) });

        // if gtfsFlex was not found return 404 to the client
        if (!gtfsFlex) {
            response.status(404);
            response.end();
            return;
        }

        // return loaded gtfsFlex
        response.send(gtfsFlex);
    }

    createAGtfsFlex = async (request: Request, response: express.Response) => {
        // get a gtfsFlex repository to perform operations with gtfsFlex
        const gtfsFlexRepository = AppDataSource.getRepository(FlexVersions);

        // create a real gtfsFlex object from gtfsFlex json object sent over http
        const newGtfsFlex = gtfsFlexRepository.create(request.body);

        // save received gtfsFlex
        await gtfsFlexRepository.save(newGtfsFlex);

        // return saved gtfsFlex back
        response.send(newGtfsFlex);
    }
}

export default GtfsFlexController;