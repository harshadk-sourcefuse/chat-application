import { inject } from '@loopback/context';
import { get, getModelSchemaRef } from '@loopback/openapi-v3';
import { repository } from '@loopback/repository';
import { Response, RestBindings } from '@loopback/rest';
import { User } from '@sourceloop/authentication-service';
import { CONTENT_TYPE, STATUS_CODE } from '@sourceloop/core';
import { authenticate, AuthenticationBindings, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { IAuthUserWithPermissions } from '../keys';
import { UserRepository } from '../repositories';

export class CustomUserController {
    private readonly html: string;
    constructor(
        @inject(RestBindings.Http.RESPONSE)
        private readonly response: Response,
        @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
        private readonly user: IAuthUserWithPermissions | undefined,
        @repository(UserRepository)
        public userRepository: UserRepository,
    ) { }

    @authenticate(
        STRATEGY.BEARER)
    @authorize({ permissions: ['*'] })
    @get('/auth/users', {
        responses: {
            [STATUS_CODE.OK]: {
                description: 'Token Response',
                content: {
                    [CONTENT_TYPE.JSON]: {
                        schema: getModelSchemaRef(User),
                    },
                },
            },
        },
    })
    async getUsers(): Promise<User[]> {
        return this.userRepository.findAll({ where: { id: { neq: this.user?.id } } });
    }


}
