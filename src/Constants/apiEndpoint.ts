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

// PACKAGE 
export const ALL_SYSTEM_PACKAGES = `${DataBaseUrl}/service-providers/system-package-list-create`
export const SYSTEM_PACKAGES_OFFER = `${DataBaseUrl}/service-providers/system-offer-list-create`
export const ALL_SP_PACKAGES = `${DataBaseUrl}/service-providers/package-list-create`


//SPS
export const LIST_CREATE_SPS = `${DataBaseUrl}/service-providers/service-provider-list-create`;
export const GET_SP_BY_ADMIN = `${DataBaseUrl}/service-providers/get-provider/admin/`;
export const WAHUMINI_LIST_CREATE = `${DataBaseUrl}/service-providers/wahumini-list-create`;
export const WAHUMINI_UPDATE_DISTROY = `${DataBaseUrl}/service-providers/wahumini-retrieve-update-destroy/`;
export const CARDS_LIST_CREATE = `${DataBaseUrl}/service-providers/cards-number-list-create`;
export const CARDS_UPDATE = `${DataBaseUrl}/service-providers/cards-number-retrieve-update-destroy/`;
export const PAYMENT_LIST_CREATE = `${DataBaseUrl}/service-providers/payment-type-list-create`;
export const PAYMENT_UPDATE = `${DataBaseUrl}/service-providers/payment-type-retrieve-update-destroy/`;
export const EXPENSE_CATEGORY_LIST_CREATE = `${DataBaseUrl}/service-providers/expense-category-list-create`;
export const EXPENSE_CATEGORY_UPDATE = `${DataBaseUrl}/service-providers/expense-category-retrieve-update-destroy/`;
export const EXPENSE_LIST_CREATE = `${DataBaseUrl}/service-providers/expense-list-create`;
export const EXPENSE_UPDATE = `${DataBaseUrl}/service-providers/expense-retrieve-update-destroy/`;
export const JUMUIYA_LIST_CREATE = `${DataBaseUrl}/service-providers/jumuiya-list-create`;
export const JUMUIYA_UPDATE = `${DataBaseUrl}/service-providers/jumuiya-retrieve-update-destroy/`;
export const KANDA_LIST_CREATE = `${DataBaseUrl}/service-providers/kanda-list-create`;
export const KANDA_UPDATE = `${DataBaseUrl}/service-providers/kanda-retrieve-update-destroy/`;
export const SP_MANAGERS = `${DataBaseUrl}/service-providers/sp-managers/`;
export const SP_REVENUES = `${DataBaseUrl}/service-providers/revenue-list-create`
export const SP_REVENUES_UPDATE = `${DataBaseUrl}/service-providers/revenue/update/`

//SP SADAKA and ZAKA
export const SADAKA_LIST_CREATE = `${DataBaseUrl}/service-providers/sadaka-list-create`;
export const ZAKA_LIST_CREATE = `${DataBaseUrl}/service-providers/zaka-list-create`;
export const ZAKA_UPDATE = `${DataBaseUrl}/service-providers/zaka-retrieve-update-destroy/`;
export const SADAKA_UPDATE = `${DataBaseUrl}/service-providers/sadaka-retrieve-update-destroy/`;
export const BAHASHA_GET_NO = `${DataBaseUrl}/service-providers/cards-number-retrieve-by-card-no/`;
export const ZAKA_MONTHLY_TOTOLS = `${DataBaseUrl}/service-providers/zaka/monthly-totals/`;
export const SADAKA_MONTHLY_TOTOLS = `${DataBaseUrl}/service-providers/sadaka/monthly-totals/`;

// MICHANGO
export const MICHANGO_LIST = `${DataBaseUrl}/service-providers/mchango-list-create`;
export const MICHANGO_RETRIEVE_UPDATE = `${DataBaseUrl}/service-providers/mchango-retrieve-update-destroy/`;
export const MICHANGO_PAYMENTS_LIST = `${DataBaseUrl}/service-providers/mchango-payment-list-create`;
export const MICHANGO_PAYMENTS_UPDATE= `${DataBaseUrl}/service-providers/mchango-payment-retrieve-update-destroy/`;


//AHADI
export const AHADI_LIST = `${DataBaseUrl}/service-providers/ahadi-list-create`;
export const AHADI_PAYMENTS = `${DataBaseUrl}/service-providers/ahadi-payments`;
export const AHADI_PAYMENTS_UPDATE = `${DataBaseUrl}/service-providers/ahadi-payments-update`;
export const AHADI_UPDATE = `${DataBaseUrl}/service-providers/ahadi-retrieve-update-destroy/`;


//STATS
export const MATUMIZI_STATS = `${DataBaseUrl}/service-providers/matumizi-stats`
export const AHADI_STATS = `${DataBaseUrl}/service-providers/ahadi-stats`
export const MICHANGO_STATS = `${DataBaseUrl}/service-providers/michango-stats`
export const SADAKA_ZAKA_STATS = `${DataBaseUrl}/service-providers/sadaka-zaka-stats`