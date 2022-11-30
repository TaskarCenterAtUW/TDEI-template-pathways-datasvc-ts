import { PathwayVersions } from "../../database/entity/pathways-version-entity";
import { GtfsPathwaysUploadModel } from "../../model/gtfs-pathways-upload-model";
import { Utility } from "../../utility/utility";
import { GtfsPathwaysService } from "../gtfs-pathways-service";
import { IGtfsPathwaysService } from "../gtfs-pathways-service-interface";
import { IEventBusServiceInterface } from "./interface/event-bus-service-interface";
import { validate } from 'class-validator';
import { AzureQueueConfig } from "nodets-ms-core/lib/core/queue/providers/azure-queue-config";
import { environment } from "../../environment/environment";
import { Core } from "nodets-ms-core";

export class EventBusService implements IEventBusServiceInterface {
    private queueConfig: AzureQueueConfig;
    private gtfsPathwayService!: IGtfsPathwaysService;

    constructor() {
        this.queueConfig = new AzureQueueConfig();
        this.gtfsPathwayService = new GtfsPathwaysService();
        this.queueConfig.connectionString = environment.eventBus.connectionString as string;
    }

    // function to handle messages
    private processUpload = async (messageReceived: any) => {
        try {
            if (!messageReceived.data) return;
            if (!messageReceived.data.is_valid) return;

            var gtfsPathwaysUploadModel = messageReceived.data as GtfsPathwaysUploadModel;
            var pathwayVersions: PathwayVersions = new PathwayVersions();
            pathwayVersions.uploaded_by = gtfsPathwaysUploadModel.user_id;
            console.log(`Received message: ${JSON.stringify(gtfsPathwaysUploadModel)}`);
            Utility.copy<PathwayVersions>(pathwayVersions, gtfsPathwaysUploadModel);

            validate(pathwayVersions).then(errors => {
                // errors is an array of validation errors
                if (errors.length > 0) {
                    console.log('Upload pathways file metadata information failed validation. errors: ', errors);
                } else {
                    this.gtfsPathwayService.createAGtfsPathway(pathwayVersions).catch((error: any) => {
                        console.log('Error saving the pathways version');
                        console.log(error);
                    });;
                }
            });
        } catch (error) {
            console.log("Error processing the upload message : error ", error, "message: ", messageReceived);
        }
    };


    // function to handle any errors
    private processUploadError = async (error: any) => {
        console.log(error);
    };

    subscribeUpload(): void {
        Core.getTopic(environment.eventBus.uploadTopic as string,
            this.queueConfig).subscribe(environment.eventBus.uploadSubscription as string, {
                onReceive: this.processUpload,
                onError: this.processUploadError
            });
    }
}