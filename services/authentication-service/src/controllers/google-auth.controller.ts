import { inject } from '@loopback/context';
import { get, param } from '@loopback/openapi-v3';
import { repository } from '@loopback/repository';
import { HttpErrors, Request, Response, RestBindings } from '@loopback/rest';
import { TokenResponse } from '@sourceloop/authentication-service/dist/modules/auth';
import { CONTENT_TYPE, STATUS_CODE } from '@sourceloop/core';
import { authenticate, authenticateClient, AuthenticationBindings, AuthErrorKeys, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { IAuthUserWithPermissions, ServiceBindings } from '../keys';
import { AuthClientRepository } from '../repositories';
import { TokenService } from '../services/token.service';

export class GoogleAuthController {
    private readonly html: string;
    constructor(
        @inject(RestBindings.Http.RESPONSE)
        private readonly response: Response,
        @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
        private readonly user: IAuthUserWithPermissions | undefined,
        @inject(ServiceBindings.TOKEN_SERVICE, { optional: true })
        private tokenService: TokenService,
        @repository(AuthClientRepository)
        public authClientRepository: AuthClientRepository,
    ) { }

    @authenticateClient(STRATEGY.CLIENT_PASSWORD)
    @authenticate(
        STRATEGY.GOOGLE_OAUTH2,
        {
            accessType: 'offline',
            scope: ['profile', 'email'],
            authorizationURL: process.env.GOOGLE_AUTH_URL,
            callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
            clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
            tokenURL: process.env.GOOGLE_AUTH_TOKEN_URL,
        },
        (req: Request) => {
            return {
                accessType: 'offline',
                state: Object.keys(req.query)
                    .map(key => key + '=' + req.query[key])
                    .join('&'),
            };
        },
    )
    @authorize({ permissions: ['*'] })
    @get('/auth/v2/google', {
        responses: {
            [STATUS_CODE.OK]: {
                description: 'Token Response',
                content: {
                    [CONTENT_TYPE.JSON]: {
                        schema: { 'x-ts-type': TokenResponse },
                    },
                },
            },
        },
    })
    async loginViaGoogle(
        @param.query.string('client_id')
        clientId?: string,
        @param.query.string('client_secret')
        clientSecret?: string,
    ): Promise<void> { }

    @authenticate(
        STRATEGY.GOOGLE_OAUTH2,
        {
            accessType: 'offline',
            scope: ['profile', 'email'],
            authorizationURL: process.env.GOOGLE_AUTH_URL,
            callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
            clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
            tokenURL: process.env.GOOGLE_AUTH_TOKEN_URL,
        },
        (req: Request) => {
            return {
                accessType: 'offline',
                state: Object.keys(req.query)
                    .map(key => `${key}=${req.query[key]}`)
                    .join('&'),
            };
        },
    )
    @authorize({ permissions: ['*'] })
    @get('/auth/v2/google-auth-redirect', {
        responses: {
            [STATUS_CODE.OK]: {
                description: 'Token Response',
                content: {
                    [CONTENT_TYPE.JSON]: {
                        schema: { 'x-ts-type': TokenResponse },
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
        const clientId = new URLSearchParams(state).get('client_id');
        if (!clientId || !this.user) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
        }
        const client = await this.authClientRepository.findOne({
            where: {
                clientId: clientId,
            },
        });
        if (!client || !client.redirectUrl) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
        }
        try {
            const token = this.tokenService.generateJWT(this.user);
            response.redirect(`${client.redirectUrl}?token=${token}`);
        } catch (error) {
            throw new HttpErrors.InternalServerError(AuthErrorKeys.UnknownError);
        }
    }

}
