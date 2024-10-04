import { DataBaseUrl } from "./BaseUrl";
// AUTH
export const POST_LOGIN = `${DataBaseUrl}/user-management/login-user`;
// export const POST_CREATE_USER = "/auth/user-setup";
export const REFRESH_TOKEN = `${DataBaseUrl}/auth/refresh-token`;
export const USER_INFO = "/auth/logged-in-user";
export const ALL_USERS = `${DataBaseUrl}/users`;
export const ALL_ROLES = `${DataBaseUrl}/roles`;
export const ALL_PERMISSIONS = `${DataBaseUrl}/permissions`;