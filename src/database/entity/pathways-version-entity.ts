import { IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../model/base-dto';

export class PathwayVersions extends BaseDto {
    //id!: number;
    @IsNotEmpty()
    tdei_record_id: string = "";
    @IsNotEmpty()
    confidence_level: number = 0;
    @IsNotEmpty()
    tdei_org_id: string = "";
    @IsNotEmpty()
    tdei_station_id: string = "";
    @IsNotEmpty()
    file_upload_path: string = "";
    uploaded_by: string = "";
    @IsNotEmpty()
    collected_by: string = "";
    @IsNotEmpty()
    collection_date: Date = new Date();
    @IsNotEmpty()
    collection_method: string = "";
    @IsNotEmpty()
    valid_from: Date = new Date();
    @IsNotEmpty()
    valid_to: Date = new Date();
    @IsNotEmpty()
    data_source: string = "";
    @IsNotEmpty()
    pathways_schema_version: string = "";
    @IsNotEmpty()
    polygon: any = {};

    constructor(init?: Partial<PathwayVersions>) {
        super();
        Object.assign(this, init);
    }
}