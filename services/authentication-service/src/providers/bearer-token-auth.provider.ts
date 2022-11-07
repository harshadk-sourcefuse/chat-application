import { inject, Provider } from '@loopback/context';
import { repository } from '@loopback/repository';
import { VerifyFunction } from 'loopback4-authentication';
import { ServiceBindings } from '../keys';
import { UserRepository } from '../repositories';
import { TokenService } from '../services/token.service';

export class BearerTokenAuth implements Provider<VerifyFunction.GoogleAuthFn>{
    constructor(
        @repository(UserRepository) private userRepo: UserRepository,
        @inject(ServiceBindings.TOKEN_SERVICE) private tokenService: TokenService
    ) {
    }

    value(): VerifyFunction.BearerFn {
        return async (token: string) => {
            const decryptedToken = this.tokenService.verifyJWT(token);
            return this.userRepo.findById(decryptedToken.id);
        }
    }

}