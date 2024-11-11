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

//PACKAGES
export const postSystemPackage = (data:any) =>  api.create(url.ALL_SYSTEM_PACKAGES, data);
export const fetchSystemPackage = () =>  api.get(url.ALL_SYSTEM_PACKAGES);
export const postSystemPackageOffer = (data:any) =>  api.create(url.SYSTEM_PACKAGES_OFFER, data);
export const fetchSystemPackageOffer = () =>  api.get(url.SYSTEM_PACKAGES_OFFER);
export const postSpPackage = (data:any) =>  api.create(url.ALL_SP_PACKAGES, data);
export const fetchSpPackage = () =>  api.get(url.ALL_SP_PACKAGES);

//SPS
export const postSpSetup = (data:any) =>  api.create(url.LIST_CREATE_SPS, data);
export const fetchSps = () =>  api.get(url.LIST_CREATE_SPS);
export const fetchSpByAdmin = (id:any) =>  api.get(url.GET_SP_BY_ADMIN + `${id}`);
export const postPayType = (data:any) =>  api.create(url.PAYMENT_LIST_CREATE, data);
export const updatePayType = (id:any, data:any) =>  api.put(url.PAYMENT_UPDATE + id, data);
export const deletePayType = (id:any) =>  api.delete(url.PAYMENT_UPDATE + id);
export const fetchPayTypes = (id:any) =>  api.get(url.PAYMENT_LIST_CREATE + `${id}`);
export const postExpCat = (data:any) =>  api.create(url.EXPENSE_CATEGORY_LIST_CREATE, data);
export const fetchtExpCat = (id:any) =>  api.get(url.EXPENSE_CATEGORY_LIST_CREATE + `${id}`);
export const updateExpCat = (id:any, data:any) =>  api.put(url.EXPENSE_CATEGORY_UPDATE + id, data);
export const deleteExpCat = (id:any) =>  api.delete(url.EXPENSE_CATEGORY_UPDATE + id);
export const fetchtExpenses = (id:any) =>  api.get(url.EXPENSE_LIST_CREATE + `${id}`);
export const postExpenses = (data:any) =>  api.create(url.EXPENSE_LIST_CREATE, data);
export const updateExpence = (id:any, data:any) =>  api.put(url.EXPENSE_UPDATE + id, data);
export const deleteExpence = (id:any) =>  api.delete(url.EXPENSE_UPDATE + `${id}`);
export const fetchtSpManagers = (id:any) =>  api.get(url.SP_MANAGERS + `${id}`);
export const updateSpManager = (id:any, data:any) =>  api.put(url.SP_MANAGERS + `${id}`, data);
export const deleteSpManager = (id:any) =>  api.delete(url.SP_MANAGERS + `${id}`);
export const postSpManagers = (data:any) =>  api.create(url.SP_MANAGERS, data);
export const postSpRevenue = (data:any) =>  api.create(url.SP_REVENUES, data);
export const postSpRevenueUpdate = (data:any) =>  api.put(url.SP_REVENUES_UPDATE, data);


//WAHUMUNI
export const fetchWahumini = (id:any) =>  api.get(url.WAHUMINI_LIST_CREATE + `${id}`);
export const postWahumini = (data:any) =>  api.create(url.WAHUMINI_LIST_CREATE, data);
export const updateMuhumini = (id:any, data:any) =>  api.put(url.WAHUMINI_UPDATE_DISTROY + id, data);
export const deleteMuhumini = (id:any) =>  api.delete(url.WAHUMINI_UPDATE_DISTROY + id);
export const postBahasha = (data:any) =>  api.create(url.CARDS_LIST_CREATE, data);
export const fetchBahasha = (id:any) =>  api.get(url.CARDS_LIST_CREATE + `${id}`);
export const updateBahasha = (id:any, data:any) =>  api.put(url.CARDS_UPDATE +  `${id}/`, data);
export const deleteBahasha = (id:any) =>  api.delete(url.CARDS_UPDATE +  `${id}/`);
export const fetchtJumuiya = (id:any) =>  api.get(url.JUMUIYA_LIST_CREATE + `${id}`);
export const postJumuiya = (data:any) =>  api.create(url.JUMUIYA_LIST_CREATE, data);
export const updateJumuiya = (id:any, data:any) =>  api.put(url.JUMUIYA_UPDATE + `${id}`, data);
export const deleteJumuiya = (id:any) =>  api.delete(url.JUMUIYA_UPDATE + `${id}`);
export const fetchtKanda = (id:any) =>  api.get(url.KANDA_LIST_CREATE + `${id}`);
export const postKanda = (data:any) =>  api.create(url.KANDA_LIST_CREATE, data);
export const updateKanda = (id:any, data:any) =>  api.put(url.KANDA_UPDATE + `${id}`, data);
export const deleteKanda = (id:any) =>  api.delete(url.KANDA_UPDATE + `${id}`);

//SADAKA ZAKA
export const fetchSadaka = (id:any) =>  api.get(url.SADAKA_LIST_CREATE + `${id}`);
export const fetchZaka = (id:any) =>  api.get(url.ZAKA_LIST_CREATE + `${id}`);
// export const fetchAhadi = (id:any) =>  api.get(url.ZAKA_LIST_CREATE + `${id}`);
export const postSadaka = (data:any) =>  api.create(url.SADAKA_LIST_CREATE, data);
export const postZaka = (data:any) =>  api.create(url.ZAKA_LIST_CREATE, data);
export const updateZaka = (id:any, data:any) =>  api.put(url.ZAKA_UPDATE + id, data);
export const updateSadaka = (id:any, data:any) =>  api.put(url.SADAKA_UPDATE + id, data);
export const fetchZakaById = (id:any) =>  api.get(url.ZAKA_UPDATE + id);
export const deleteZakaById = (id:any) =>  api.delete(url.ZAKA_UPDATE + id);
export const deleteSadakaById = (id:any) =>  api.delete(url.SADAKA_UPDATE + id);
export const resolveBahasha = (id:any) =>  api.get(url.BAHASHA_GET_NO + `${id}`);
export const resolveZakaTotals = (id:any) =>  api.get(url.ZAKA_MONTHLY_TOTOLS + `${id}`);
export const resolveSadakaTotals = (id:any) =>  api.get(url.SADAKA_MONTHLY_TOTOLS + `${id}`);

//MCHANGO
export const fetchMichango = (id:any) =>  api.get(url.MICHANGO_LIST + `${id}`);
export const postMichango = (data:any) =>  api.create(url.MICHANGO_LIST, data);
export const deleteMichango = (id:any) =>  api.delete(url.MICHANGO_RETRIEVE_UPDATE + `${id}`);
export const editMichango = (id:any, data:any) =>  api.put(url.MICHANGO_RETRIEVE_UPDATE + `${id}`, data);
export const fetchMichangoPayment = (id:any) =>  api.get(url.MICHANGO_PAYMENTS_LIST + `${id}`);
export const postMichangoPayment = (data:any) =>  api.create(url.MICHANGO_PAYMENTS_LIST, data);
export const retrieveMichangoPayment = (id:any) =>  api.get(url.MICHANGO_PAYMENTS_UPDATE + `${id}`);

//AHADI
export const fetchAhadi = (id:any) =>  api.get(url.AHADI_LIST + `${id}`);
export const postAhadi = (data:any) =>  api.create(url.AHADI_LIST, data);
export const postAhadiPayment = (data:any) =>  api.create(url.AHADI_PAYMENTS, data);
export const updateAhadi = (id:any, data:any) =>  api.put(url.AHADI_UPDATE + `${id}`, data);
export const deleteAhadi = (id:any) =>  api.delete(url.AHADI_UPDATE + `${id}`);

//STATS
export const fetchAhadiStats = (id:any) =>  api.get(url.AHADI_STATS + `${id}`);
export const fetchSadataZakaStats = (id:any) =>  api.get(url.SADAKA_ZAKA_STATS + `${id}`);
export const fetchMatumiziStats = (id:any) =>  api.get(url.MATUMIZI_STATS + `${id}`);
export const fetchMichangoStats = (id:any) =>  api.get(url.MICHANGO_STATS + `${id}`);
