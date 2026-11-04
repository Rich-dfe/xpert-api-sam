import * as licenseRepository from "../repositories/licenseRepository";
import {
  mergeLicensePeriods,
  isDateRangeLicensed,
} from "../lib/licenseHelpers";
import type { LicenseValidationResult } from "../types/license";

export async function validateLoggerLicense(
  loggerUid: string,
  startDate: number,
  endDate: number,
): Promise<LicenseValidationResult> {
  //Get all license periods for this logger
  const licensePeriods =
    await licenseRepository.getLoggerLicensePeriods(loggerUid);

  // No licences means unrestricted access
  if (licensePeriods.length === 0) {
    return {
      valid: true,
    };
  }

  //Merge consecutive or overlapping periods.(There shouldn't be any overlapping periods so this is precautionary)
  const mergedPeriods = mergeLicensePeriods(licensePeriods);

  const isLicensed = isDateRangeLicensed(startDate, endDate, mergedPeriods);

  if (!isLicensed) {
    return {
      valid: false,
      message: "The selected date range is not covered by a valid licence.",
    };
  }

  return {
    valid: true,
  };
}
