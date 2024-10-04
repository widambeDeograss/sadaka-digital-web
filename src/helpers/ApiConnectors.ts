import { APIClient } from "./ApiHelper";
import * as url from "../Constants/apiEndpoint"


const api = new APIClient();

//auth
export const fetchLoggedInUser = (data:any) => api.get(url.USER_INFO, data);
export const postLogin = (data:any) => api.create(url.POST_LOGIN, data);
export const postUserSetup = (data:any) => api.create(url.ALL_USERS, data);
export const postUserEdit = (data:any) => api.put(url.ALL_USERS, data);
export const postPermissionSetup = (data:any) => api.create(url.ALL_PERMISSIONS, data);
export const postRoleSetup = (data:any) => api.create(url.ALL_ROLES, data);
export const putRoleEdit = (data:any) => api.put(url.ALL_ROLES, data);
export const putPermissionEdit = (data:any, id:number) => api.put(url.ALL_PERMISSIONS, data);
export const fetchAllUsers = (data:any) => api.get(url.ALL_USERS, data);
export const fetchRoles = () => api.get(url.ALL_ROLES);
export const fetchPermissions = () => api.get(url.ALL_PERMISSIONS);