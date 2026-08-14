import * as loggerRepository from "../repositories/loggerRespository";
import { isUser, isAdmin, isSuper } from "../lib/permissions";
import { RequestContext } from "../lib/requestContext";
import * as loggerAuthorizationRepository from "../repositories/loggerAuthorizationRepository";

export async function getloggerAuthorization(
  loggerUid: string,
  context: RequestContext,
): Promise<boolean | null> {
    console.log('IN SERVICE',context);
  if (isUser(context)) {
    const isUserAuthorized = loggerAuthorizationRepository.isLoggerOwnedByUser(loggerUid,context.user.id);
    return isUserAuthorized
  } else if (isAdmin(context)) {
    const isAdminAuthorized = loggerAuthorizationRepository.isLoggerOwnedByAdmin(loggerUid,context.user.customerId);
    return isAdminAuthorized;
  } else if( isSuper(context)){
    //If a super user allow all permissions
    return true;
  }

  //If there is an unknown role deny any permission to do anything. 
  return false;
}