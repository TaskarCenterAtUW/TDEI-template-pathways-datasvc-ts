import { GtfsFlexUploadModel } from "../../model/gtfs-flex-upload-model";
import { IEventBusServiceInterface } from "./interface/event-bus-service-interface";
import { AzureServiceBusProvider } from "./provider/azure-service-bus-provider";

export class EventBusService implements IEventBusServiceInterface {
    private azureServiceBusProvider!: AzureServiceBusProvider;

    constructor() {
        this.azureServiceBusProvider = new AzureServiceBusProvider();
        this.azureServiceBusProvider.initialize();
    }

    // function to handle messages
    private processUpload = async (messageReceived: any) => {
        var gtfsFlexUploadModel = messageReceived.body as GtfsFlexUploadModel;
        console.log(`Received message: ${JSON.stringify(gtfsFlexUploadModel)}`);
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