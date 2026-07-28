import { RequestContext } from "../lib/requestContext";
import { isAdmin, isSuper } from "../lib/permissions";
import * as customerRepository from "../repositories/customerRepository";
import * as userRepository from "../repositories/userRepository"


export async function listCustomers(context: RequestContext){
    if(isSuper(context)){
        return customerRepository.listCustomers();
    }else if(isAdmin(context)){
        return userRepository.listAdminCustomers(context.user.id);
    }

    throw new Error("Users are not authorized to list customers.");
}

export async function listUsersByCustomer(custId: String, context: RequestContext){
    if(isAdmin(context) || isSuper(context)){
        return customerRepository.listUsersByCustomer(custId);
    }
}

export async function listGroupsByCustomerUser(custId: string, userId:string){
    return customerRepository.listGroupsByCustomerUser(custId, userId);
}

export async function listLoggersByCustomerUserGroup(custId: string, userId:string, groupId:string){
    //If 'Show All Loggers' is selected from the groups menu it returns -1  
    if(groupId === "-1"){
        return customerRepository.listLoggersByCustomerUser(custId, userId);
    }else{
        return customerRepository.listLoggersByCustomerUserGroup(custId, userId, groupId);
    }
}