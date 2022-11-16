import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Polygon } from "../../model/polygon-model";

@Entity()
export class PathwayVersions {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    tdei_org_id: string = "";

    @Column()
    tdei_station_id: string = "";

    @Column()
    file_upload_path: string = "";

    @Column()
    uploaded_by: string = "";

    @Column()
    collected_by: string = "";

    @Column("timestamp")
    collection_date: Date = new Date();

    @Column()
    collection_method: string = "";

    @Column("timestamp")
    valid_from: Date = new Date();

    @Column("timestamp")
    valid_to: Date = new Date();

    @Column()
    data_source: string = "";

    @Column()
    pathways_schema_version: string = "";
}