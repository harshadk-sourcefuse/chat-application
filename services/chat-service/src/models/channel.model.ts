import { Entity, model, property } from '@loopback/repository';

@model({
  name : "channels"
})
export class Channel extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  @property({
    type: 'string',
    name: "sender_id",
    required: true,
  })
  senderId: string;

  @property({
    type: 'string',
    name: "reciever_id",
    required: true,
  })
  recieverId: string;


  constructor(data?: Partial<Channel>) {
    super(data);
  }
}

export interface ChannelRelations {
  // describe navigational properties here
}

export type ChannelWithRelations = Channel & ChannelRelations;
