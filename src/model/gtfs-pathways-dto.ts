
export class GtfsPathwaysDTO {
    tdei_org_id: string = "";
    tdei_station_id: string = "";
    collected_by: string = "";
    collection_date: Date = new Date();
    collection_method: string = "";
    valid_from: Date = new Date();
    valid_to: Date = new Date();
    data_source: string = "";
    pathways_schema_version: string = "";
}