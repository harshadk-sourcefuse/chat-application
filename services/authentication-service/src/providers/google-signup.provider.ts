import { inject, Provider, Setter } from '@loopback/context';
import { AuthenticationBindings, GoogleSignUpFn } from '@sourceloop/authentication-service';
import { ILogger, LOGGER } from '@sourceloop/core';
import { IAuthUserWithPermissions, ServiceBindings } from '../keys';
import { UserService } from '../services/user.service';
import { Profile, UserDTO } from '../types';


export class GoogleSignupProvider
    implements Provider<GoogleSignUpFn>
{
    constructor(
        @inject.setter(AuthenticationBindings.CURRENT_USER)
        private setCurrentUser: Setter<IAuthUserWithPermissions>,
        @inject(LOGGER.LOGGER_INJECT) private logger: ILogger,
        @inject(ServiceBindings.USER_SERVICE) private userService: UserService
    ) { }

    value(): any {
        return async (profile: Profile) => {
            this.logger.info("user successfully signed-up using Google account, saving user in db.");
            this.logger.info("profile <<<=====>>>" + JSON.stringify(profile._json));

            const userObj = profile._json;
            const userDTO: UserDTO = Object.assign({}, {
                firstName: userObj.given_name as string,
                lastName: userObj.family_name as string,
                clientId: process.env.DEFAULT_CLIENT_ID as string,
                username: (userObj.email as string).toLowerCase(),
                email: (userObj.email as string).toLowerCase()
            });
            const userAndUserWithPermisson = await this.userService.createUser(userDTO);
            this.setCurrentUser(userAndUserWithPermisson.userWithPermisson);
            return userAndUserWithPermisson.user;
        };
    }
}
