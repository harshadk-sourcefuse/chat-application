import { inject } from '@loopback/core';
import { CountSchema, Filter, Where } from '@loopback/repository';
import {
  get,
  getModelSchemaRef, getWhereSchemaFor, param, patch, post,
  requestBody, Response, RestBindings
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings, STRATEGY
} from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PubnubMessageRecipient, Pubnubnotification } from '../models';
import { PubnubMessage } from '../models/pubnub-message.model';
import { PermissionKey } from '../permission-key.enum';
import { Messageservice, Notificationservice } from '../services';
import { Authservice } from '../services/authservice.service';

export class PubnubMessageController {
  constructor(
    @inject('services.Messageservice')
    private readonly messageService: Messageservice,
    @inject('services.Notificationservice')
    private readonly notifService: Notificationservice,
    @inject('services.Authservice')
    private readonly authService: Authservice,

  ) { }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewMessage] })
  @get('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Message model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PubnubMessage, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) user: IAuthUserWithPermissions,
    @param.header.string('Authorization') token: string,
    @param.query.string('ChannelID') channelID?: string,
    @param.filter(PubnubMessage) filter?: Filter<PubnubMessage>,
  ): Promise<PubnubMessage[]> {
    const filter1: Filter<PubnubMessage> = {
      where: {
        channelId: channelID,
      },
      order: ['createdOn ASC'],
    };
    return this.messageService.getMessage(token, filter1);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.CreateMessage] })
  @post('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message model instance',
        content: {
          [CONTENT_TYPE.JSON]: { schema: getModelSchemaRef(PubnubMessage) },
        },
      },
    },
  })
  async create(
    @param.header.string('Authorization') token: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(PubnubMessage, {
            title: 'Message',
            exclude: ['id'],
          }),
        },
      },
    })
    message: PubnubMessage,
  ): Promise<PubnubMessage> {
    message.channelId = message.channelId ?? message.toUserId;
    const msg = await this.messageService.createMessage(message, token);
    const msgrecipient = new PubnubMessageRecipient({
      channelId: message.channelId,
      recipientId: message.toUserId ?? message.channelId,
      messageId: msg.id,
    });
    await this.messageService.createMessageRecipients(msgrecipient, token);
    const notif = new Pubnubnotification({
      subject: message.subject,
      body: message.body,
      type: 0,
      receiver: {
        to: [
          {
            type: 0,
            id: message.channelId,
          },
        ],
      },
    });
    await this.notifService.createNotification(notif, token);

    return msg;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.UpdateMessageRecipient] })
  @patch(`messages/{messageid}/markAsRead`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message PATCH success count',
        content: { [CONTENT_TYPE.JSON]: { schema: CountSchema } },
      },
    },
  })
  async patchMessageRecipients(
    @param.header.string('Authorization') token: string,
    @param.path.string('messageid') msgId: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(PubnubMessageRecipient, { partial: true }),
        },
      },
    })
    messageRecipient: Partial<PubnubMessageRecipient>,
    @param.query.object('where', getWhereSchemaFor(PubnubMessageRecipient))
    where?: Where<PubnubMessageRecipient>,
  ): Promise<PubnubMessageRecipient> {
    const patched = {
      isRead: true,
    };

    return this.messageService.updateMsgRecipients(msgId, patched, token);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ['*'] })
  @get('/userTenantId', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'To get the userTenantId',
        content: {
          [CONTENT_TYPE.TEXT]: {
            type: 'string',
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER) user: IAuthUserWithPermissions,
    @param.header.string('Authorization') token: string,
  ): Promise<string> {
    if (user.userTenantId) {
      return user.userTenantId;
    } else {
      return '';
    }
  }

  @authorize({ permissions: ['*'] })
  @get('/auth/google', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { 'x-ts-type': {} },
          },
        },
      },
    },
  })
  async loginViaGoogle(
    @param.query.string('client_id')
    clientId: string,
    @param.query.string('client_secret')
    clientSecret: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    await this.authService.googleLogin(clientId, clientSecret);
  }


  @authorize({ permissions: ['*'] })
  @get('/auth/google-auth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { 'x-ts-type': {} },
          },
        },
      },
    },
  })
  async googleCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    await this.authService.googleOauthRedirect(code, state);
  }

  @authorize({ permissions: ['*'] })
  @get('/auth/me', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { 'x-ts-type': {} },
          },
        },
      },
    },
  })
  async authMe(
    @param.header.string('Authorization') token: string,
  ): Promise<Object> {
    return this.authService.authMe(token);
  }

  @authorize({ permissions: ['*'] })
  @get('/auth/token', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { 'x-ts-type': {} },
          },
        },
      },
    },
  })
  async authToken(
    @param.query.string('code') code: string,
    @param.query.string('client_id') clientId?: string,
  ): Promise<Object> {
    return this.authService.authToken(code, (clientId ?? process.env.CLIENT_ID as string));
  }

  @authorize({ permissions: ['*'] })
  @get('/auth/users', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { 'x-ts-type': {} },
          },
        },
      },
    },
  })
  async getUsers(
    @param.header.string('Authorization') token: string
  ): Promise<Object[]> {
    return this.authService.getUsers(token);
  }

  // Map to `GET /ping`
  @authorize({ permissions: ['*'] })
  @post('/channel/get-or-create', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Ping Response',
        content: {
          'application/json': {
            schema: {
              type: "object",
              properties: {
                id: { type: 'string' },
                memberIds: {
                  type: 'array',
                  items: {
                    type: "string"
                  }
                },
              }
            }
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
  body: { memberIds: string[] }): Promise<Object> {
    return this.messageService.getOrCreateChannel(body.memberIds);
  }
}
