import { inject } from "@loopback/context";
import { AnyObject, repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";
import { AuthClient, Role, Tenant, User, UserTenant } from "@sourceloop/authentication-service";
import { ILogger, LOGGER, RoleTypes, UserStatus } from "@sourceloop/core";
import { IAuthUserWithPermissions } from "../keys";
import { AuthClientRepository, RoleRepository, TenantRepository, UserRepository, UserTenantRepository } from "../repositories";
import { UserDTO } from "../types";

export class UserService {

    constructor(
        @inject(LOGGER.LOGGER_INJECT) private logger: ILogger,
        @repository(UserRepository) private userRepo: UserRepository,
        @repository(AuthClientRepository) private authClientRepo: AuthClientRepository,
        @repository(RoleRepository) private roleRepo: RoleRepository,
        @repository(TenantRepository) private tenantRepo: TenantRepository,
        @repository(UserTenantRepository) private userTenantRepo: UserTenantRepository,
    ) { }

    async createUser(userObj: UserDTO) {
        this.logger.info("--- Creating User ----");

        let user: User;
        const [tenant, role, authClient] = await Promise.all(
            [
                this.getDefaultTenant(),
                this.getDefaultRole(),
                this.getAuthClient(userObj.clientId)
            ]);
        if (!authClient.id) {
            throw new HttpErrors.BadRequest("Auth client not found");
        }

        const options: AnyObject = {};

        const existingUser = await this.userRepo.findOne({
            where: {
                or: [{ username: userObj.username }, { email: userObj.email }]
            }
        });
        if (!existingUser) {
            this.logger.info("--- User Not Exists ----");
            // const user =new User();
            user = await this.userRepo.createWithoutPassword(new User({
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                email: userObj.email,
                username: userObj.username,
                // phone: userObj.phone,
                defaultTenantId: tenant.id,
                authClientIds: `{${authClient.id?.toString()}}`
            }), options);
            this.logger.info("--- User Created ----");
            await this.userTenantRepo.create(new UserTenant({
                roleId: role.id,
                status: UserStatus.ACTIVE,
                tenantId: tenant.id,
                userId: user.id
            }), options);
            this.logger.info("--- tenant User map created ----");
        } else {
            this.logger.info("--- User Exists ----");
            const existingUserTenantMap = await this.userTenantRepo.findOne({
                where: {
                    userId: existingUser.id,
                    tenantId: tenant.id
                }
            });
            if (existingUserTenantMap) {
                this.logger.info("--- tenant User map exists----");
                throw new HttpErrors.BadRequest("User already exists");
            }
            this.logger.info("--- tenant User map does not exists----");
            await this.userTenantRepo.create({
                roleId: role.id,
                status: UserStatus.ACTIVE,
                tenantId: tenant.id,
                userId: existingUser.id
            }, options);
            this.logger.info("--- tenant User map created ----");
            user = existingUser;
        }
        const userWithPermisson: IAuthUserWithPermissions = {
            id: user.id,
            permissions: role.permissions,
            authClientId: authClient.id,
            email: user.email,
            role: role.name,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            username: user.username
        }
        return { user, userWithPermisson }
    }

    async getDefaultRole(): Promise<Role> {
        const role = await this.roleRepo.findOne({
            where:
                { roleType: RoleTypes.Others, name: process.env.DEFAULT_USER_ROLE }
        });
        if (!role || !role.id) {
            this.logger.error(`Role with name - ${process.env.DEFAULT_USER_ROLE} not found`);
            throw new HttpErrors.BadRequest(`Role not found`);
        }
        return role;
    }

    async getDefaultTenant(): Promise<Tenant> {
        const tenant = await this.tenantRepo.findOne({
            where:
                { key: process.env.DEFAULT_TENANT_KEY }
        });
        if (!tenant || !tenant.id) {
            this.logger.error(`Tenant with key - ${process.env.DEFAULT_TENANT_KEY} not found`);
            throw new HttpErrors.BadRequest(`Tenant not found`);
        }
        return tenant;
    }

    async getAuthClient(clientId: string): Promise<AuthClient> {
        const authClient = await this.authClientRepo.findOne({
            where:
                { clientId: clientId }
        });
        if (!authClient) {
            this.logger.error("Invalid Client is provided.");
            throw new HttpErrors.BadRequest("Invalid Client is provided.");
        }
        return authClient
    }

    async getUserWithPermissonObj(user: User, clientId: string): Promise<IAuthUserWithPermissions> {
        const [role, authClient] = await Promise.all(
            [
                this.getDefaultRole(),
                this.getAuthClient(clientId)
            ]);
        if (!authClient.id) {
            throw new HttpErrors.BadRequest("Auth client not found");
        }
        const userWithPermisson: IAuthUserWithPermissions = {
            id: user.id,
            permissions: role.permissions,
            authClientId: authClient.id,
            email: user.email,
            role: role.name,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            username: user.username
        }
        return userWithPermisson;
    }
}