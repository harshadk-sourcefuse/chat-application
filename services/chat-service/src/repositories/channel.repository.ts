import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ChatDbDataSource} from '../datasources';
import {Channel, ChannelRelations} from '../models';

export class ChannelRepository extends DefaultCrudRepository<
  Channel,
  typeof Channel.prototype.id,
  ChannelRelations
> {
  constructor(
    @inject('datasources.chatDb') dataSource: ChatDbDataSource,
  ) {
    super(Channel, dataSource);
  }
}
