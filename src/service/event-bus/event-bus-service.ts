import { PathwayVersions } from "../../database/entity/pathways-version-entity";
import { GtfsPathwaysUploadModel } from "../../model/gtfs-pathways-upload-model";
import { GtfsPathwaysService } from "../gtfs-pathways-service";
import { IGtfsPathwaysService } from "../gtfs-pathways-service-interface";
import { IEventBusServiceInterface } from "./interface/event-bus-service-interface";
import { AzureServiceBusProvider } from "./provider/azure-service-bus-provider";

export class EventBusService implements IEventBusServiceInterface {
    private azureServiceBusProvider!: AzureServiceBusProvider;
    private gtfsPathwayService!: IGtfsPathwaysService;

    constructor() {
        this.azureServiceBusProvider = new AzureServiceBusProvider();
        this.gtfsPathwayService = new GtfsPathwaysService();
        this.azureServiceBusProvider.initialize();
    }

    // function to handle messages
    private processUpload = async (messageReceived: any) => {
        var gtfsFlexUploadModel = messageReceived.body.data as GtfsPathwaysUploadModel;
        var pathwayVersions: PathwayVersions = new PathwayVersions();
        pathwayVersions.uploaded_by = gtfsFlexUploadModel.user_id;
        this.copy(pathwayVersions, gtfsFlexUploadModel);
        console.log(`Received message: ${JSON.stringify(gtfsFlexUploadModel)}`);
        this.gtfsPathwayService.createAGtfsPathway(pathwayVersions);
    };

    private copy(target: any, source: any): any {
        return Object.keys(target).forEach(key => {
            if (source[key] != undefined) {
                target[key] = source[key];
            }
        }
        );
    }
    // function to handle any errors
    private processUploadError = async (error: any) => {
        console.log(error);
    };

    subscribeUpload(): void {
        this.azureServiceBusProvider.subscribe({
            processMessage: this.processUpload,
            processError: this.processUploadError
        });
    }
}