export class PathwaysQueryParams {
    pathways_schema_version: string | undefined;
    date_time: string | undefined;
    tdei_org_id: string | undefined;
    tdei_record_id: number | undefined;
    tdei_station_id: string | undefined;
    confidence_level: string | undefined;
    page_no: number = 1;
    page_size: number = 10;
}