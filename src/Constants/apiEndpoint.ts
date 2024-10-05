import { DataBaseUrl } from "./BaseUrl";
// AUTH
export const POST_LOGIN = `${DataBaseUrl}/user-management/login-user`;
export const POST_CREATE_USER = `${DataBaseUrl}/user-management/register-user`;
export const USERS = `${DataBaseUrl}/user-management/users`;
// export const POST_CREATE_USER = "/auth/user-setup";
export const REFRESH_TOKEN = `${DataBaseUrl}/auth/refresh-token`;
export const USER_INFO = "/auth/logged-in-user";
export const ALL_USERS = `${DataBaseUrl}/users`;
export const ALL_ROLES = `${DataBaseUrl}/user-management/system-role-list-create`;
export const ALL_PERMISSIONS = `${DataBaseUrl}/permissions`;


//SPS
export const LIST_CREATE_SPS = `${DataBaseUrl}/service-providers/service-provider-list-create`;
export const GET_SP_BY_ADMIN = `${DataBaseUrl}/service-providers/get-provider/admin/`;

