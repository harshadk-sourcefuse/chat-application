import { BindingKey } from "@loopback/context";
import { IAuthUser } from "loopback4-authentication";
import { IUserPrefs } from "loopback4-authorization";
import { GoogleOauthProvider, GoogleSignupProvider } from "./providers";
import { TokenService } from "./services/token.service";
import { UserService } from "./services/user.service";

export namespace ServiceBindings {
    export const USER_SERVICE = BindingKey.create<UserService>("services.user");
    export const TOKEN_SERVICE = BindingKey.create<TokenService>("services.token");
}

export namespace ProviderBindings {
    export const GOOGLE_OAUTH_PROVIDER = BindingKey.create<GoogleOauthProvider>("providers.google-ouath");
    export const GOOGLE_SIGNUP_PROVIDER = BindingKey.create<GoogleSignupProvider>("providers.google-signup");
}

export interface IAuthUserWithPermissions<ID = string, TID = string, UTID = string> extends IAuthUser {
    id?: string;
    identifier?: ID;
    permissions: string[];
    authClientId: number;
    userPreferences?: IUserPrefs;
    email?: string;
    role: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    tenantId?: TID;
    userTenantId?: UTID;
    passwordExpiryTime?: Date;
    allowedResources?: string[];
}
