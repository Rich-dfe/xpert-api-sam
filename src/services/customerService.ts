import { RequestContext } from "../lib/requestContext";
import { isAdmin, isSuper } from "../lib/permissions";
import * as customerRepository from "../repositories/customerRepository";


export async function listCustomers(context: RequestContext){
    if(isSuper(context)){
        return customerRepository.listCustomers();
    }else if(isAdmin(context)){
        return customerRepository.listCustomersForAdmin(context.user.id);
    }
}

export async function listUsersByCustomer(custId: String, context: RequestContext){
    if(isAdmin(context) || isSuper(context)){
        return customerRepository.listUsersByCustomer(custId);
    }
}

export async function listGroupsByCustomerUser(custId: string, userId:string){
    return customerRepository.listGroupsByCustomerUser(custId, userId);
}