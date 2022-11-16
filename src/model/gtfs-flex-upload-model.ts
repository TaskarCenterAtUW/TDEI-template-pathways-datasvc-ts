import { Polygon } from "./polygon-model";


export class GtfsFlexUploadModel {
    id!: number;
    filePath!: string;
    version!: string;
    collected_by!: string;
    collection_date!: Date;
    collection_method!: string;
    valid_from!: Date;
    valid_to!: Date;
    data_source!: string;
    polygon!: Polygon;
}
