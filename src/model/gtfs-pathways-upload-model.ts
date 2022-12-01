
export class GtfsPathwaysUploadModel {
    user_id!: string;
    tdei_record_id!: string;
    tdei_org_id!: string;
    tdei_station_id!: string;
    file_upload_path!: string;
    collected_by!: string;
    collection_date!: Date;
    collection_method!: string;
    valid_from!: Date;
    valid_to!: Date;
    data_source!: string;
    pathways_schema_version!: string;
}

