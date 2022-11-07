import { environment } from "src/environments/environment";

export class ApiConstants {
    public static readonly LOGIN_SIGNUP = `${environment.AUTH_URL}/auth/google`;
    public static readonly LOGIN = `${environment.AUTH_URL}/auth/login`;
    public static readonly MESSAGES = `${environment.BASE_URL}/messages`;
    public static readonly GET_LOGGEDIN_USER = `${environment.BASE_URL}/auth/me`;
    public static readonly AUTH_TOKEN = `${environment.BASE_URL}/auth/token`;
    public static readonly USERS = `${environment.BASE_URL}/auth/users`;
    public static readonly GET_OR_CREATE_CHANNEL = `${environment.BASE_URL}/channel/get-or-create`;
    public static readonly LOGOUT = `${environment.AUTH_URL}/logout`;
    
}