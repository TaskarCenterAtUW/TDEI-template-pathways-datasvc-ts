import { Core } from "nodets-ms-core";
import { FileEntity } from "nodets-ms-core/lib/core/storage";
import format from "pg-format";
import dbClient from "../database/data-source";
import { PathwayVersions } from "../database/entity/pathways-version-entity";
import HttpException from "../exceptions/http/http-base-exception";
import { GtfsPathwaysDTO } from "../model/gtfs-pathways-dto";
import { PathwaysQueryParams } from "../model/gtfs-pathways-get-query-params";
import { Utility } from "../utility/utility";
import { IGtfsPathwaysService } from "./gtfs-pathways-service-interface";

class GtfsPathwaysService implements IGtfsPathwaysService {
    constructor() { }

    async getAllGtfsPathway(params: PathwaysQueryParams): Promise<GtfsPathwaysDTO[]> {

        console.log("Sql Query", params.toSqlStr());

        let result = await dbClient.query(params.toSqlStr());

        let list: GtfsPathwaysDTO[] = [];
        result.rows.forEach(x => {

            let pathway: GtfsPathwaysDTO = Utility.copy<GtfsPathwaysDTO>(new GtfsPathwaysDTO(), x);;
            list.push(pathway);
        })
        return Promise.resolve(list);
    }

    async getGtfsPathwayById(id: string): Promise<FileEntity> {

        var sql = format('Select file_upload_path from pathway_versions WHERE tdei_record_id = %L', id);

        let result = await dbClient.query(sql);

        if (result.rows.length == 0) throw new HttpException(400, "Record not found");

        const storageClient = Core.getStorageClient();
        if (storageClient == null) throw console.error("Storage not configured");
        let url: string = decodeURIComponent(result.rows[0].file_upload_path);
        return storageClient.getFileFromUrl(url);
    }

    async createAGtfsPathway(pathwayInfo: PathwayVersions): Promise<GtfsPathwaysDTO> {
        try {
            pathwayInfo.file_upload_path = decodeURIComponent(pathwayInfo.file_upload_path!);
            const query = `INSERT INTO public.pathway_versions(tdei_record_id, 
                            confidence_level, 
                            tdei_org_id, 
                            tdei_station_id, 
                            file_upload_path, 
                            uploaded_by,
                            collected_by, 
                            collection_date, 
                            collection_method, valid_from, valid_to, data_source,
                            pathways_schema_version)
                            VALUES ('${pathwayInfo.tdei_record_id}', 
                            0,
                            '${pathwayInfo.tdei_org_id}', 
                            '${pathwayInfo.tdei_station_id}', 
                            '${pathwayInfo.file_upload_path}', 
                            '${pathwayInfo.uploaded_by}',
                            '${pathwayInfo.collected_by}',
                            '${pathwayInfo.collection_date}', 
                            '${pathwayInfo.collection_method}', '${pathwayInfo.valid_from}', '${pathwayInfo.valid_to}',
                            '${pathwayInfo.data_source}', '${pathwayInfo.pathways_schema_version}')`;

            console.log(query);
            let result = await dbClient.query(query);

            let pathway: GtfsPathwaysDTO = Utility.copy<GtfsPathwaysDTO>(new GtfsPathwaysDTO(), pathwayInfo);

            return Promise.resolve(pathway);
        } catch (error) {
            console.log("Error saving the pathways version", error);
            return Promise.reject(error);
        }

    }
}

const gtfsPathwaysService = new GtfsPathwaysService();
export default gtfsPathwaysService;
