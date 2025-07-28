import { APIClient } from "./ApiHelper";
import * as url from "../Constants/apiEndpoint";

const api = new APIClient();

//auth
export const fetchLoggedInUser = (data: any) => api.get(url.USER_INFO, data);
// export const fetchUsers = () => api.get(url.USERS);
export const postLogin = (data: any) => api.create(url.POST_LOGIN, data);
export const postUserSetup = (data: any) =>
  api.create(url.POST_CREATE_USER, data);
export const postUserEdit = (data: any) => api.put(url.ALL_USERS, data);
export const postPermissionSetup = (data: any) =>
  api.create(url.ALL_PERMISSIONS, data);
export const postRoleSetup = (data: any) => api.create(url.ALL_ROLES, data);
export const putRoleEdit = (data: any) => api.put(url.ALL_ROLES, data);
export const putPermissionEdit = (data: any, _id: number) =>
  api.put(url.ALL_PERMISSIONS, data);
export const fetchAllUsers = (params: any) => api.get(url.USERS + params);
export const fetchRoles = () => api.get(url.ALL_ROLES);
export const fetchPermissions = () => api.get(url.ALL_PERMISSIONS);
export const deactivateActivateUsers = (data: any) =>
  api.get(url.ACTIVATE_DEACTIVATE_STAFF + data);

//PACKAGES
export const postSystemPackage = (data: any) =>
  api.create(url.ALL_SYSTEM_PACKAGES, data);
export const fetchSystemPackage = () => api.get(url.ALL_SYSTEM_PACKAGES);
export const postSystemPackageOffer = (data: any) =>
  api.create(url.SYSTEM_PACKAGES_OFFER, data);
export const fetchSystemPackageOffer = () => api.get(url.SYSTEM_PACKAGES_OFFER);
export const postSpPackage = (data: any) =>
  api.create(url.ALL_SP_PACKAGES, data);
export const fetchSpPackage = (id: any) => api.get(url.ALL_SP_PACKAGES + id);

//SPS
export const postSpSetup = (data: any) => api.create(url.LIST_CREATE_SPS, data);
export const updateSp = (id: any, data: any) =>
  api.put(url.LIST_UPDATE_SP + id, data);
export const fetchSps = () => api.get(url.LIST_CREATE_SPS);
export const fetchSpByAdmin = (id: any) =>
  api.get(url.GET_SP_BY_ADMIN + `${id}`);
export const postPayType = (data: any) =>
  api.create(url.PAYMENT_LIST_CREATE, data);
export const updatePayType = (id: any, data: any) =>
  api.put(url.PAYMENT_UPDATE + id, data);
export const deletePayType = (id: any) => api.delete(url.PAYMENT_UPDATE + id);
export const fetchPayTypes = (id: any) =>
  api.get(url.PAYMENT_LIST_CREATE + `${id}`);
export const postExpCat = (data: any) =>
  api.create(url.EXPENSE_CATEGORY_LIST_CREATE, data);
export const fetchtExpCat = (id: any) =>
  api.get(url.EXPENSE_CATEGORY_LIST_CREATE + `${id}`);
export const updateExpCat = (id: any, data: any) =>
  api.put(url.EXPENSE_CATEGORY_UPDATE + id, data);
export const deleteExpCat = (id: any) =>
  api.delete(url.EXPENSE_CATEGORY_UPDATE + id);
export const fetchtExpenses = (id: any) =>
  api.get(url.EXPENSE_LIST_CREATE + `${id}`);
export const postExpenses = (data: any) =>
  api.create(url.EXPENSE_LIST_CREATE, data);
export const updateExpence = (id: any, data: any) =>
  api.put(url.EXPENSE_UPDATE + id, data);
export const deleteExpence = (id: any) =>
  api.delete(url.EXPENSE_UPDATE + `${id}`);
export const fetchtSpManagers = (id: any) => api.get(url.SP_MANAGERS + `${id}`);
export const updateSpManager = (id: any, data: any) =>
  api.put(url.SP_MANAGERS + `${id}`, data);
export const deleteSpManager = (id: any) =>
  api.delete(url.SP_MANAGERS + `${id}`);
export const postSpManagers = (data: any) =>
  api.create(url.CREATE_SP_MANAGER, data);
export const postSpRevenue = (data: any) => api.create(url.SP_REVENUES, data);
export const postSpRevenueUpdate = (data: any) =>
  api.put(url.SP_REVENUES_UPDATE, data);

//WAHUMUNI
export const fetchWahumini = (id: any, type?: any) =>
  api.get(url.WAHUMINI_LIST_CREATE + `${id}`, {}, type);
export const postWahumini = (data: any) =>
  api.create(url.WAHUMINI_LIST_CREATE, data);
export const updateMuhumini = (id: any, data: any) =>
  api.put(url.WAHUMINI_UPDATE_DISTROY + id, data);
export const retrieveMuumini = (id: any) => {
  return api.get(url.WAHUMINI_UPDATE_DISTROY + id);
};
export const deleteMuhumini = (id: any) =>
  api.delete(url.WAHUMINI_UPDATE_DISTROY + id);
export const postBahasha = (data: any) =>
  api.create(url.CARDS_LIST_CREATE, data);
export const fetchBahasha = (id: any, type?: any) =>
  api.get(url.CARDS_LIST_CREATE + `${id}`, {}, type);
export const updateBahasha = (id: any, data: any) =>
  api.put(url.CARDS_UPDATE + `${id}/`, data);
export const deleteBahasha = (id: any) =>
  api.delete(url.CARDS_UPDATE + `${id}/`);
export const fetchtJumuiya = (id: any) =>
  api.get(url.JUMUIYA_LIST_CREATE + `${id}`);
export const postJumuiya = (data: any) =>
  api.create(url.JUMUIYA_LIST_CREATE, data);
export const updateJumuiya = (id: any, data: any) =>
  api.put(url.JUMUIYA_UPDATE + `${id}`, data);
export const deleteJumuiya = (id: any) =>
  api.delete(url.JUMUIYA_UPDATE + `${id}`);
export const fetchtKanda = (id: any, type?: "blob" | "json") =>
  api.get(url.KANDA_LIST_CREATE + `${id}`, {}, type);
export const postKanda = (data: any) => api.create(url.KANDA_LIST_CREATE, data);
export const updateKanda = (id: any, data: any) =>
  api.put(url.KANDA_UPDATE + `${id}`, data);
export const deleteKanda = (id: any) => api.delete(url.KANDA_UPDATE + `${id}`);

//SADAKA ZAKA
export const fetchSadaka = (id: any, type?: any) =>
  api.get(url.SADAKA_LIST_CREATE + `${id}`, {}, type);
export const fetchSadakaType = (id: any) =>
  api.get(url.SADAKA_TYPE_LIST_CREATE + `${id}`);
export const fetchZaka = (id: any, type?: any) =>
  api.get(url.ZAKA_LIST_CREATE + `${id}`, {}, type);
// export const fetchAhadi = (id:any) =>  api.get(url.ZAKA_LIST_CREATE + `${id}`);
export const postSadaka = (data: any) =>
  api.create(url.SADAKA_LIST_CREATE, data);
export const postSadakaType = (data: any) =>
  api.create(url.SADAKA_TYPE_LIST_CREATE, data);
export const postZaka = (data: any) => api.create(url.ZAKA_LIST_CREATE, data);
export const updateZaka = (id: any, data: any) =>
  api.put(url.ZAKA_UPDATE + id, data);
export const updateSadaka = (id: any, data: any) =>
  api.put(url.SADAKA_UPDATE + id, data);
export const updateSadakaType = (id: any, data: any) =>
  api.put(url.SADAKA_TYPE_UPDATE + id, data);
export const fetchZakaById = (id: any) => api.get(url.ZAKA_UPDATE + id);
export const deleteZakaById = (id: any) => api.delete(url.ZAKA_UPDATE + id);
export const deleteSadakaById = (id: any) => api.delete(url.SADAKA_UPDATE + id);
export const deleteSadakaTypeById = (id: any) =>
  api.delete(url.SADAKA_TYPE_UPDATE + id);
export const resolveBahasha = (id: any) =>
  api.get(url.BAHASHA_GET_NO + `${id}`);
export const resolveZakaTotals = (id: any) =>
  api.get(url.ZAKA_MONTHLY_TOTOLS + `${id}`);
export const resolveSadakaTotals = (id: any) =>
  api.get(url.SADAKA_MONTHLY_TOTOLS + `${id}`);

//MCHANGO
export const fetchMichango = (id: any) => api.get(url.MICHANGO_LIST + `${id}`);
export const postMichango = (data: any) => api.create(url.MICHANGO_LIST, data);
export const deleteMichango = (id: any) =>
  api.delete(url.MICHANGO_RETRIEVE_UPDATE + `${id}`);
export const editMichango = (id: any, data: any) =>
  api.put(url.MICHANGO_RETRIEVE_UPDATE + `${id}`, data);
export const fetchMichangoPayment = (id: any) =>
  api.get(url.MICHANGO_PAYMENTS_LIST + `${id}`);
export const postMichangoPayment = (data: any) =>
  api.create(url.MICHANGO_PAYMENTS_LIST, data);
export const retrieveMichangoPayment = (id: any) =>
  api.get(url.MICHANGO_PAYMENTS_UPDATE + `${id}`);

//AHADI
export const fetchAhadi = (id: any) => api.get(url.AHADI_LIST + `${id}`);
export const fetchAhadiPayments = (id: any) =>
  api.get(url.AHADI_PAYMENTS + `${id}`);
export const postAhadi = (data: any) => api.create(url.AHADI_LIST, data);
export const postAhadiPayment = (data: any) =>
  api.create(url.AHADI_PAYMENTS, data);
export const updateAhadi = (id: any, data: any) =>
  api.put(url.AHADI_UPDATE + `${id}`, data);
export const deleteAhadi = (id: any) => api.delete(url.AHADI_UPDATE + `${id}`);

//STATS
export const fetchAhadiStats = (id: any) => api.get(url.AHADI_STATS + `${id}`);
export const fetchSadataZakaStats = (id: any) =>
  api.get(url.SADAKA_ZAKA_STATS + `${id}`);
export const fetchMatumiziStats = (id: any) =>
  api.get(url.MATUMIZI_STATS + `${id}`);
export const fetchMichangoStats = (id: any) =>
  api.get(url.MICHANGO_STATS + `${id}`);
export const fetchMchangoStats = (id: any) =>
  api.get(url.MCHANGO_STATS + `${id}`);
export const fetchMhuminiStats = (id: any) =>
  api.get(url.MHUMINI_STATS + `${id}`);
export const fetchZakBahashaInfo = (id: any) =>
  api.get(url.ZAKA_BAHASHA_CHECK + `${id}`);
export const fetchDashboard = (id: any) =>
  api.get(url.DASHBORD_STATS + `${id}`);
export const fetchMavunoStats = (id: any) =>
  api.get(url.MAVUNO_STATS + `${id}`);

//MAVUNO
export const fetchMavuno = (id: any) =>
  api.get(url.MAVUNO_LIST_CREATE + `${id}`);
export const postMavuno = (data: any) =>
  api.create(url.MAVUNO_LIST_CREATE, data);
export const updateMavuno = (id: any, data: any) =>
  api.put(url.MAVUNO_RETRIEVE_UPDATE_DESTROY + `${id}`, data);
export const retrieveMavuno = (id: any) =>
  api.get(url.MAVUNO_RETRIEVE_UPDATE_DESTROY + `${id}`);
export const deleteMavuno = (id: any) =>
  api.delete(url.MAVUNO_RETRIEVE_UPDATE_DESTROY + `${id}`);
export const fetchMavunoPayments = (id: any) =>
  api.get(url.MAVUNO_PAYMENT_LIST_CREATE + `${id}`);
export const postMavunoPayment = (data: any) =>
  api.create(url.MAVUNO_PAYMENT_LIST_CREATE, data);
export const updateMavunoPayment = (id: any, data: any) =>
  api.put(url.MAVUNO_PAYMENT_RETRIEVE_UPDATE_DESTROY + `${id}`, data);
export const deleteMavunoPayment = (id: any) =>
  api.delete(url.MAVUNO_PAYMENT_RETRIEVE_UPDATE_DESTROY + `${id}`);

//REPORTS
export const fetchWahuminiStatement = (id: any) =>
  api.get(url.WAHUMINI_STATEMENT, id);
export const fetchRevenueStatement = (id: any) =>
  api.get(url.REVENUE_STATEMENT, id);
export const fetchExpenseStatement = (id: any) =>
  api.get(url.EXPENSE_STATEMENT, id);
export const fetchPaymentTypeRev = (id: any, data: any) =>
  api.get(url.PAYMENT_LIST_REPORT + id, data);
export const fetchPaymentTypeTransfer = (id: any, data?: any) =>
  api.get(url.PAYMENT_TYPE_TRANSFER_CREATE + id, {}, data);
export const postPaymentTypeTransfer = (data: any) =>
  api.create(url.PAYMENT_TYPE_TRANSFER_CREATE, data);
export const updatePaymentTypeTransfer = (id: any, data: any) =>
  api.put(url.PAYMENT_TYPE_TRANSFER_UPDATE + `${id}`, data);
export const deletePaymentTypeTransfer = (id: any) =>
  api.delete(url.PAYMENT_TYPE_TRANSFER_UPDATE + `${id}`);

//SMS
export const sendCustomSms = (data: any) =>
  api.create(url.SEND_CUSTOM_SMS, data);
