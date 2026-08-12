import * as loggerRepository from "../repositories/loggerRespository";
import { isUser, isAdmin, isSuper } from "../lib/permissions";
import { RequestContext } from "../lib/requestContext";
import { LoggerConfigSettings } from "../types/logger";

export async function getloggerAuthorization(
  loggerId: string,
  context: RequestContext,
): Promise<boolean | null> {
  if (isUser(context)) {
    console.log("CONTEXT USER ID", context.user.id);
    const dbLoggerLookup = await loggerRepository.getLogger(loggerId);
    console.log("DB LOGGER DATA USER ID", dbLoggerLookup);
    if(context.user.id != dbLoggerLookup?.user_id){
        return false;
    }
  } else if (isAdmin(context)) {
    //See if the logger belongs to any customers that belong to the admin
  } else if( isSuper(context)){
    console.log("In logger auth as super");
  }

  return true;
}