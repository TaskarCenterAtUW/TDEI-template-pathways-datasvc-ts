export interface EventBusMessageHandlers {
    /**
     * Handler that processes messages from service bus.
     *
     * @param message - A message received from Service Bus.
     */
    processMessage(message: any): Promise<void>;
    /**
     * Handler that processes errors that occur during receiving.
     */
    processError(args: any): Promise<void>;
}