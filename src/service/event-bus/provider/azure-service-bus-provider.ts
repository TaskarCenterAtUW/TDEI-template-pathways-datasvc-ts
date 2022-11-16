import { ServiceBusClient, ServiceBusReceiver } from "@azure/service-bus";
import { environment } from "../../../environment/environment";
import { EventBusMessageHandlers } from "../interface/event-bus-handler-interface";
import { IEventBusProviderInterface } from "../interface/event-bus-provider-interface";

export class AzureServiceBusProvider implements IEventBusProviderInterface {
    private serviceBusClient!: ServiceBusClient;
    private serviceBusReceiver!: ServiceBusReceiver;

    initialize() {
        // create a Service Bus client using the connection string to the Service Bus namespace
        this.serviceBusClient = new ServiceBusClient(environment.eventBus.connectionString as string);

        // createReceiver() can also be used to create a receiver for a queue.
        this.serviceBusReceiver = this.serviceBusClient.createReceiver(environment.eventBus.uploadTopic as string, environment.eventBus.uploadSubscription as string);
    }


    subscribe(handlers: EventBusMessageHandlers): void {
        this.serviceBusReceiver.subscribe({
            processMessage: handlers.processMessage,
            processError: handlers.processError
        });
    }
}