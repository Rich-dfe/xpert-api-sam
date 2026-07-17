import * as userRepository from "../repositories/userRepository";
import { RequestContext } from "../lib/requestContext";
import { User } from "../types/user";
import { isSuper } from "../lib/permissions";

export async function getUserByEmail(
  email: string
): Promise<User | null> {
  return userRepository.findUserByEmail(email);
}

export async function listUsers(context: RequestContext){
    if(isSuper(context)){
        return userRepository.listUsers();
    }
}