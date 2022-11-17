import { Equal, FindOptionsWhere, Raw } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { PathwayVersions } from "../database/entity/pathways-version-entity";
import { GtfsPathwaysDTO } from "../model/gtfs-pathways-dto";
import { PathwaysQueryParams } from "../model/gtfs-pathways-get-query-params";
import { Utility } from "../utility/utility";
import { IGtfsPathwaysService } from "./gtfs-pathways-service-interface";

export class GtfsPathwaysService implements IGtfsPathwaysService {
    constructor() {

    }


    async getAllGtfsPathway(params: PathwaysQueryParams): Promise<GtfsPathwaysDTO[]> {
        // get a gtfsPathway repository to perform operations with gtfsPathway
        const gtfsPathwayRepository = AppDataSource.getRepository(PathwayVersions);

        //Set defaults if not provided
        if (params.page_no == undefined) params.page_no = 1;
        if (params.page_size == undefined) params.page_size = 10;
        let skip = params.page_no == 1 ? 0 : (params.page_no - 1) * params.page_size;
        let take = params.page_size > 50 ? 50 : params.page_size;

        let where: FindOptionsWhere<PathwayVersions> = {};

        if (params.pathways_schema_version) where.pathways_schema_version = Equal(params.pathways_schema_version);
        if (params.tdei_org_id) where.tdei_org_id = Equal(params.tdei_org_id);
        if (params.tdei_record_id) where.tdei_record_id = Equal(params.tdei_record_id);
        if (params.tdei_station_id) where.tdei_station_id = Equal(params.tdei_station_id);
        if (params.date_time && Utility.dateIsValid(params.date_time)) where.valid_to = Raw((alias) => `${alias} > :date`, { date: params.date_time });

        // load a gtfsPathway by a given gtfsPathway id.
        const gtfsPathways = await gtfsPathwayRepository.find({
            where: where,
            order: {
                tdei_record_id: "DESC",
            },
            skip: skip,
            take: take,
        });

        let list: GtfsPathwaysDTO[] = [];
        gtfsPathways.forEach(x => {

            let pathway: GtfsPathwaysDTO = Utility.copy<GtfsPathwaysDTO>(new GtfsPathwaysDTO(), x);;
            list.push(pathway);
        })
        return Promise.resolve(list);
    }

    async getGtfsPathwayById(id: string): Promise<string | null> {
        // get a gtfsPathway repository to perform operations with gtfsPathway
        const gtfsPathwayRepository = AppDataSource.getRepository(PathwayVersions);

        // load a gtfsPathway by a given gtfsPathway id
        const gtfsPathway: PathwayVersions | any = await gtfsPathwayRepository.findOneBy(
            {
                tdei_record_id: Number.parseInt(id)
            });

        return Promise.resolve(gtfsPathway?.file_upload_path);
    }

    async createAGtfsPathway(pathwayInfo: PathwayVersions): Promise<GtfsPathwaysDTO> {
        // get a gtfsPathway repository to perform operations with gtfsPathway
        const gtfsPathwayRepository = AppDataSource.getRepository(PathwayVersions);

        // create a real gtfsPathway object from gtfsPathway json object sent over http
        const newGtfsPathway = gtfsPathwayRepository.create(pathwayInfo);

        // save received gtfsPathway
        await gtfsPathwayRepository.save(newGtfsPathway);
        let pathway: GtfsPathwaysDTO = Utility.copy<GtfsPathwaysDTO>(new GtfsPathwaysDTO(), newGtfsPathway);

        return Promise.resolve(pathway);
    }
}
