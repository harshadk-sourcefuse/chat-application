import { inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { NotificationDataSource } from '../datasources';
import { Pubnubnotification } from '../models';

export interface Notificationservice {
  getNotification(token: string): Promise<Pubnubnotification[]>;
  createNotification(
    data: Pubnubnotification,
    token: string,
  ): Promise<Pubnubnotification>;
}

export class NotificationserviceProvider
  implements Provider<Notificationservice>
{
  constructor(
    @inject('datasources.notification')
    protected dataSource: NotificationDataSource = new NotificationDataSource(),
  ) { }

  value(): Promise<Notificationservice> {
    return getService(this.dataSource);
  }
}
