import { PathwayVersions } from "../../database/entity/pathways-version-entity";
import { GtfsPathwaysUploadModel } from "../../model/gtfs-pathways-upload-model";
import { Utility } from "../../utility/utility";
import { GtfsPathwaysService } from "../gtfs-pathways-service";
import { IGtfsPathwaysService } from "../gtfs-pathways-service-interface";
import { IEventBusServiceInterface } from "./interface/event-bus-service-interface";
import { AzureServiceBusProvider } from "./provider/azure-service-bus-provider";
import {
    validate
} from 'class-validator';

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
        console.log(`Received message: ${JSON.stringify(gtfsFlexUploadModel)}`);
        Utility.copy<PathwayVersions>(pathwayVersions, gtfsFlexUploadModel);

        validate(pathwayVersions).then(errors => {
            // errors is an array of validation errors
            if (errors.length > 0) {
                console.log('Upload pathways file metadata information failed validation. errors: ', errors);
            } else {
                this.gtfsPathwayService.createAGtfsPathway(pathwayVersions);
            }
        });
    };


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