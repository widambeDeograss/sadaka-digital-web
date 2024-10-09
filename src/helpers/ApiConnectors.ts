import { APIClient } from "./ApiHelper";
import * as url from "../Constants/apiEndpoint"


const api = new APIClient();

//auth
export const fetchLoggedInUser = (data:any) => api.get(url.USER_INFO, data);
// export const fetchUsers = () => api.get(url.USERS);
export const postLogin = (data:any) => api.create(url.POST_LOGIN, data);
export const postUserSetup = (data:any) => api.create(url.POST_CREATE_USER, data);
export const postUserEdit = (data:any) => api.put(url.ALL_USERS, data);
export const postPermissionSetup = (data:any) => api.create(url.ALL_PERMISSIONS, data);
export const postRoleSetup = (data:any) => api.create(url.ALL_ROLES, data);
export const putRoleEdit = (data:any) => api.put(url.ALL_ROLES, data);
export const putPermissionEdit = (data:any, id:number) => api.put(url.ALL_PERMISSIONS, data);
export const fetchAllUsers = (params:any) => api.get(url.USERS + params);
export const fetchRoles = () => api.get(url.ALL_ROLES);
export const fetchPermissions = () => api.get(url.ALL_PERMISSIONS);


//SPS
export const postSpSetup = (data:any) =>  api.create(url.LIST_CREATE_SPS, data);
export const fetchSps = () =>  api.get(url.LIST_CREATE_SPS);
export const fetchSpByAdmin = (id:any) =>  api.get(url.GET_SP_BY_ADMIN + `${id}`);

//WAHUMUNI
export const fetchWahumini = (id:any) =>  api.get(url.WAHUMINI_LIST_CREATE + `${id}`);
export const postWahumini = (data:any) =>  api.create(url.WAHUMINI_LIST_CREATE, data);
export const postBahasha = (data:any) =>  api.create(url.CARDS_LIST_CREATE, data);
export const postPayType = (data:any) =>  api.create(url.PAYMENT_LIST_CREATE, data);
export const fetchBahasha = (id:any) =>  api.get(url.CARDS_LIST_CREATE + `${id}`);
export const fetchPayTypes = (id:any) =>  api.get(url.PAYMENT_LIST_CREATE + `${id}`);

//SADAKA ZAKA
export const fetchSadaka = (id:any) =>  api.get(url.SADAKA_LIST_CREATE + `${id}`);
export const fetchZaka = (id:any) =>  api.get(url.ZAKA_LIST_CREATE + `${id}`);
export const fetchAhadi = (id:any) =>  api.get(url.ZAKA_LIST_CREATE + `${id}`);
export const postSadaka = (data:any) =>  api.create(url.SADAKA_LIST_CREATE, data);
export const postZaka = (data:any) =>  api.create(url.ZAKA_LIST_CREATE, data);
export const resolveBahasha = (id:any) =>  api.get(url.BAHASHA_GET_NO + `${id}`);