import { inject } from "@loopback/context";
import { get, getModelSchemaRef, post, requestBody } from "@loopback/openapi-v3";
import { repository } from "@loopback/repository";
import { RestBindings, Request } from "@loopback/rest";
import { STATUS_CODE } from "@sourceloop/core";
import { authorize } from "loopback4-authorization";
import { Channel } from "../models";
import { ChannelRepository } from "../repositories";

export class ChannelController {
    constructor(
        @inject(RestBindings.Http.REQUEST) private readonly req: Request,
        @repository(ChannelRepository) private channelRepository: ChannelRepository
    ) { }

    // Map to `GET /ping`
    @authorize({ permissions: ['*'] })
    @post('/channel/get-or-create', {
        responses: {
            [STATUS_CODE.OK]: {
                description: 'Ping Response',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(Channel)
                    }
                }
            }
        },
    })
    async getOrCreateChannel(@requestBody({
        content: {
            'application/json': {
                schema: {
                    type: "object",
                    properties: {
                        memberIds: {
                            type: 'array',
                            items: {
                                type: "string"
                            }
                        },
                    }
                }
            },
        },
    })
    body: { memberIds: string[] }): Promise<Channel> {
        const channel = await this.channelRepository.findOne({
            where: {
                or: [
                    {
                        senderId: body.memberIds[0],
                        recieverId: body.memberIds[1]
                    },
                    {
                        senderId: body.memberIds[1],
                        recieverId: body.memberIds[0]
                    },
                ]

            }
        });
        if (channel)
            return channel;
        else
            return await this.channelRepository.create({
                senderId: body.memberIds[0],
                recieverId: body.memberIds[1]
            })
    }
}
