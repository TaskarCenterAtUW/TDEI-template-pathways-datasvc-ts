import { Utility } from "../utility/utility";

export class PathwaysQueryParams {
    pathways_schema_version: string | undefined;
    date_time: string | undefined;
    tdei_org_id: string | undefined;
    tdei_record_id: string | undefined;
    tdei_station_id: string | undefined;
    confidence_level: number = 0;
    page_no: number = 1;
    page_size: number = 10;

    constructor(init?: Partial<PathwaysQueryParams>) {
        Object.assign(this, init);
    }

    toSqlStr() {
        let select: string = "Select * from pathway_versions";
        let where: string = "Where";

        //Set defaults if not provided
        if (this.page_no == undefined) this.page_no = 1;
        if (this.page_size == undefined) this.page_size = 10;
        let skip = this.page_no == 1 ? 0 : (this.page_no - 1) * this.page_size;
        let take = this.page_size > 50 ? 50 : this.page_size;


        if (this.pathways_schema_version)
            where = where.concat(" ", "pathways_schema_version", "='", this.pathways_schema_version, "' ", " and");
        if (this.tdei_org_id)
            where = where.concat(" ", "tdei_org_id", "='", this.tdei_org_id, "' ", " and");
        if (this.tdei_record_id)
            where = where.concat(" ", "tdei_record_id", "='", this.tdei_record_id, "' ", " and");
        if (this.tdei_station_id)
            where = where.concat(" ", "tdei_station_id", "='", this.tdei_station_id, "' ", " and");
        if (this.date_time && Utility.dateIsValid(this.date_time))
            where = where.concat(" ", "valid_to", ">'", this.date_time, "' ");
        //Check if no where clouse specified, then remove where clouse
        if (where == "Where")
            where = "";

        where = this.removeLastWord(where, 'and');

        where = where.concat(" ", "ORDER BY", " ", "updated_date DESC", " ");
        where = where.concat(" ", "LIMIT", " ", take.toString(), " ");
        where = where.concat(" ", "OFFSET", " ", skip.toString(), " ");

        return select.concat(" ", where);
    }

    removeLastWord(str: string, wordToRemove: string) {
        const lastIndexOfSpace = str.lastIndexOf(' ');

        if (lastIndexOfSpace === -1) {
            return str;
        }

        return str.substring(0, lastIndexOfSpace);
    }
}