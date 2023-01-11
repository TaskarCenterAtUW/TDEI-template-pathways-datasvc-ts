import { Core } from "nodets-ms-core";
import { FileEntity } from "nodets-ms-core/lib/core/storage";
import { QueryConfig } from "pg";
import dbClient from "../database/data-source";
import { PathwayVersions } from "../database/entity/pathways-version-entity";
import UniqueKeyDbException from "../exceptions/db/database-exceptions";
import HttpException from "../exceptions/http/http-base-exception";
import { DuplicateException } from "../exceptions/http/http-exceptions";
import { GtfsPathwaysDTO } from "../model/gtfs-pathways-dto";
import { PathwaysQueryParams } from "../model/gtfs-pathways-get-query-params";
import { Utility } from "../utility/utility";
import { IGtfsPathwaysService } from "./gtfs-pathways-service-interface";

class GtfsPathwaysService implements IGtfsPathwaysService {
    constructor() { }

    async getAllGtfsPathway(params: PathwaysQueryParams): Promise<GtfsPathwaysDTO[]> {

        //Builds the query object. All the query consitions can be build in getQueryObject()
        let queryObject = params.getQueryObject();

        let queryConfig = <QueryConfig>{
            text: queryObject.getQuery(),
            values: queryObject.getValues()
        }

        let result = await dbClient.query(queryConfig);

        let list: GtfsPathwaysDTO[] = [];
        result.rows.forEach(x => {

            let pathway: GtfsPathwaysDTO = Utility.copy<GtfsPathwaysDTO>(new GtfsPathwaysDTO(), x);;
            list.push(pathway);
        })
        return Promise.resolve(list);
    }

    async getGtfsPathwayById(id: string): Promise<FileEntity> {

        const query = {
            text: 'Select file_upload_path from pathway_versions WHERE tdei_record_id = $1',
            values: [id],
        }

        let result = await dbClient.query(query);

        if (result.rows.length == 0) throw new HttpException(400, "Record not found");

        const storageClient = Core.getStorageClient();
        if (storageClient == null) throw console.error("Storage not configured");
        let url: string = decodeURIComponent(result.rows[0].file_upload_path);
        return storageClient.getFileFromUrl(url);
    }

    async createGtfsPathway(pathwayInfo: PathwayVersions): Promise<GtfsPathwaysDTO> {
        try {
            pathwayInfo.file_upload_path = decodeURIComponent(pathwayInfo.file_upload_path!);
            const queryObject = {
                text: `INSERT INTO public.pathway_versions(tdei_record_id, 
                    confidence_level, 
                    tdei_org_id, 
                    tdei_station_id, 
                    file_upload_path, 
                    uploaded_by,
                    collected_by, 
                    collection_date, 
                    collection_method, valid_from, valid_to, data_source,
                    pathways_schema_version)
                    VALUES ($1,0,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`.replace(/\n/g, ""),
                values: [pathwayInfo.tdei_record_id, pathwayInfo.tdei_org_id, pathwayInfo.tdei_station_id, pathwayInfo.file_upload_path, pathwayInfo.uploaded_by
                    , pathwayInfo.collected_by, pathwayInfo.collection_date, pathwayInfo.collection_method, pathwayInfo.valid_from, pathwayInfo.valid_to, pathwayInfo.data_source, pathwayInfo.pathways_schema_version],
            }

            let result = await dbClient.query(queryObject);

            let pathway: GtfsPathwaysDTO = Utility.copy<GtfsPathwaysDTO>(new GtfsPathwaysDTO(), pathwayInfo);

            return Promise.resolve(pathway);
        } catch (error) {

            if (error instanceof UniqueKeyDbException) {
                throw new DuplicateException(pathwayInfo.tdei_record_id);
            }

            console.log("Error saving the pathways version", error);
            return Promise.reject(error);
        }

    }
}

const gtfsPathwaysService = new GtfsPathwaysService();
export default gtfsPathwaysService;
