import { inject, Provider } from '@loopback/context';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { GoogleSignUpFn, SignUpBindings } from '@sourceloop/authentication-service';
import { AuthErrorKeys, VerifyFunction } from 'loopback4-authentication';
import { UserRepository, UserTenantRepository } from '../repositories';
import { Profile } from '../types';


export class GoogleOauthProvider
    implements Provider<VerifyFunction.GoogleAuthFn>
{
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @repository(UserTenantRepository)
        public userTenantRepository: UserTenantRepository,
        @inject(SignUpBindings.GOOGLE_SIGN_UP_PROVIDER) private googleSignupProvider: GoogleSignUpFn
    ) { }

    value(): VerifyFunction.GoogleAuthFn {
        return async (accessToken, refreshToken, profile) => {
            let user = await this.userRepository.findOne({
                where: {
                    email: (profile as Profile)._json.email as string,
                },
            });
            if (!user) {
                const createdUser = await this.googleSignupProvider(profile);
                if (!createdUser) {
                    throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
                }
                user = createdUser;
            }

            return user;
        };
    }


}
