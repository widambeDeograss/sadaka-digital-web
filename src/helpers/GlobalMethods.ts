// import moment from "moment-timezone";


export class GlobalMethod {

    static hasAnyPermission(permissionName:any[], userPermissions:any[]) {
      // console.log(permissionName, userPermissions);
      
      return permissionName?.some((item) => userPermissions.indexOf(item) !== -1);
    }
  
    static getUserPermissionName(permissionArray:any[]) {
      // console.log(permissionArray);
      
      let permissionNameExist:any = [];
      try {
        permissionArray.forEach((valuePermission) => {
          permissionNameExist.push(valuePermission?.permission_name);
        });
      } catch (exception) {
        permissionNameExist = [];
      }
      return permissionNameExist;
    }
  
  //   static formatDate(date) {
  //     var date = moment(date).tz("Africa/Nairobi").format("YYYY-MM-DDTHH:mm:ss");
  //     return date;
  //   }
  
    static makeInitialsFromName(name:string) {
      const initials = name.match(/\b\w/g) || [];
      const result = initials.map((initial:string) => initial.toUpperCase()).join('');
      return result;
    }
  
    static calculateTax(amount:number,tax:any) {
       const taxAmount=amount-((amount*100)/(parseFloat(tax)+100))
       return taxAmount;
    }
  
    static getPrice(billedAmount:number,Quantity:number,discount:number) {
      return (billedAmount+discount)/Quantity;
   }
  
    static twoDecimalWithoutRounding = (n:any) => {
      try{
      return parseFloat(n.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);}
      catch(e){
        return 0;
      }
    };
  
    static formatCurrency(n:number){
      try{
          return n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");}
      catch(e){
        return "0.0";
      }
    }
  
  
  }
  