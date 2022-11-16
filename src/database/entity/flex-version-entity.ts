import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Polygon } from "../../model/polygon-model";

@Entity()
export class FlexVersions {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    filePath!: string;

    @Column()
    version!: string;

    @Column()
    collected_by!: string;

    @Column("timestamp")
    collection_date!: Date;

    @Column()
    collection_method!: string;

    @Column("timestamp")
    valid_from!: Date;

    @Column("timestamp")
    valid_to!: Date;

    @Column()
    data_source !: string;

    @Column("json")
    polygon!: Polygon;

}