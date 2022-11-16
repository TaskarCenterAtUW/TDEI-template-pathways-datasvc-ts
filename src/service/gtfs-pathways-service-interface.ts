import { PathwayVersions } from "../database/entity/pathways-version-entity";

export interface IGtfsPathwaysService {
    getAllGtfsPathway(): Promise<PathwayVersions[]>;
    getGtfsPathwayById(id: string): Promise<PathwayVersions | null>;
    createAGtfsPathway(pathwayInfo: PathwayVersions): Promise<PathwayVersions>;
}