import { getPool } from "../lib/database";
import type { ChartDataCalibrationSettings, ChartDataCalibrationSettingsMpt, ChartDataCalibrationSettingsPar, ChartDataCalibrationSettingsRainGauge, ChartDataCalibrationSettingsWaterLevel, ChartDataCalibrationSettingsTemperature } from "../types/calibrationSettings";

export async function getChartDataCalibrationSettings(
  loggerUid: string,
  typeId: number,
): Promise<ChartDataCalibrationSettings[]> {

  const pool = getPool();

  switch (typeId) {
    case 4131: {
      const [rows] = await pool.query<ChartDataCalibrationSettingsWaterLevel[]>(
        `SELECT a,b,e,calibration_temperature AS calibrationTemperature
         FROM user_calibration_data_wl
         WHERE logger_uid = ?`,
        [loggerUid],
      );

      return rows;
    }

    case 4132: {
      const [rows] = await pool.query<ChartDataCalibrationSettingsPar[]>(
        `SELECT ucd.logger_value, ucd.reference_value, ucd.reference_interval,ucd.par_units,us.x0018
         FROM user_calibration_data_par AS ucd
         JOIN user_settings AS us ON us.logger_id = ucd.logger_id
         WHERE ucd.logger_uid = ?`,
        [loggerUid],
      );

      return rows;
    }

    case 4137: {
      const [rows] = await pool.query<ChartDataCalibrationSettingsRainGauge[]>(
        `SELECT scaling_factor, units
         FROM user_calibration_data_rg
         WHERE logger_uid = ?`,
        [loggerUid],
      );

      return rows;
    }

    case 4161: {
      const [rows] = await pool.query<ChartDataCalibrationSettingsMpt[]>(
        `SELECT ucd.dry_limit_line,ucd.fc_limit_line,ucd.wilt_point,ucd.slope,ucd.offset,ucd.cal_type
         FROM user_calibration_data_mp_sensors AS ucd
         JOIN loggers AS l ON l.mp_sensor_id = ucd.sensor_id
         WHERE l.logger_uid = ?
         ORDER BY ucd.sensor_order`,
        [loggerUid],
      );

      return rows;
    }


    case 4181: {
      const [rows] = await pool.query<ChartDataCalibrationSettingsTemperature[]>(
        `SELECT units
         FROM user_calibration_data_temp_loggers
         WHERE logger_uid = ?`,
        [loggerUid],
      );

      return rows;
    }

    //There are no settings required for the wiper.
    case 4294: {
      return [];
    }

    default:
      throw new Error(`Unsupported logger type: ${typeId}`);
  }
}