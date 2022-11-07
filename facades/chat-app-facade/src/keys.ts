import { BindingKey } from "@loopback/context";
import { Authservice, Messageservice, Notificationservice } from "./services";

export namespace ServiceBindings {
    export const AUTHENTICCATION_SERVICE = BindingKey.create<Authservice>('services.authentication');
    export const MESSAGE_SERVICE = BindingKey.create<Messageservice>('services.message');
    export const NOTIFICATION_SERVICE = BindingKey.create<Notificationservice>('services.notification');
}