import { FileEntity } from "nodets-ms-core/lib/core/storage";
import { PathwayVersions } from "../database/entity/pathways-version-entity";
import { GtfsPathwaysDTO } from "../model/gtfs-pathways-dto";
import { PathwaysQueryParams } from "../model/gtfs-pathways-get-query-params";

export interface IGtfsPathwaysService {
    getAllGtfsPathway(params: PathwaysQueryParams): Promise<GtfsPathwaysDTO[]>;
    getGtfsPathwayById(id: string): Promise<FileEntity>;
    createAGtfsPathway(pathwayInfo: PathwayVersions): Promise<GtfsPathwaysDTO>;
}