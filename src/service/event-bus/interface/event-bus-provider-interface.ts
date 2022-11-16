import { MessageHandlers } from "@azure/service-bus"
import { receiveMessageOnPort } from "worker_threads"
import { EventBusMessageHandlers } from "./event-bus-handler-interface"

export interface IEventBusProviderInterface {
    subscribe(handlers : EventBusMessageHandlers): void
}