import { IsNotEmpty } from 'class-validator';

export class PathwayVersions {
    id!: number;
    tdei_record_id: string = "";
    confidence_level: number = 0;
    tdei_org_id: string = "";
    tdei_station_id: string = "";
    file_upload_path: string = "";
    uploaded_by: string = "";
    collected_by: string = "";
    collection_date: Date = new Date();
    collection_method: string = "";
    valid_from: Date = new Date();
    valid_to: Date = new Date();
    data_source: string = "";
    pathways_schema_version: string = "";
    polygon: any = {};

    constructor(init?: Partial<PathwayVersions>) {
        Object.assign(this, init);
    }
}