export interface appStateInterface{
    isPageLoading:boolean;
    isDarkMode:boolean;
    isUserAuthenticated:boolean;
    alertState:boolean;
    alertMessage:string;
    severity:string;
}

export const appState:appStateInterface = {
    isPageLoading:false,
    isDarkMode:true,
    isUserAuthenticated:false,
    alertState:false,
    alertMessage:"",
    severity:""
}
