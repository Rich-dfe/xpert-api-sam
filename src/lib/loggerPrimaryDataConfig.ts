import { MeasurementUnit } from "../types/measurementUnits";

export interface MeasurementConfig {
  field: string;
  name: string;
  availableUnits: MeasurementUnit[];
  defaultUnit: MeasurementUnit;
}

export interface LoggerMeasurementConfig {
  [loggerTypeId: number]: MeasurementConfig[];
}

export const loggerMeasurementConfig: LoggerMeasurementConfig = {
  4129: [
    {
      field: "data1",
      name: "Conductivity",
      availableUnits: [
        MeasurementUnit.MICROSIEMENS,
      ],
      defaultUnit: MeasurementUnit.MILLISIEMENS,
    },
    {
      field: "data2",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],

  4130: [
    {
      field: "data1",
      name: "Depth",
      availableUnits: [
        MeasurementUnit.CENTIMETRES,
      ],
      defaultUnit: MeasurementUnit.MILLIMETRES,
    },
    {
      field: "data2",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],

  4131: [
    {
      field: "data1",
      name: "Water Level",
      availableUnits: [
        MeasurementUnit.METRES,
        MeasurementUnit.MILLIMETRES,
        MeasurementUnit.FEET,
      ],
      defaultUnit: MeasurementUnit.MILLIMETRES,
    },
    {
      field: "data2",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],

  4132: [
    {
      field: "data1",
      name: "PAR",
      availableUnits: [
        MeasurementUnit.PAR,
      ],
      defaultUnit: MeasurementUnit.PAR,
     
    },
    {
      field: "data2",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],

  4134: [
    {
      field: "data1",
      name: "Water Level",
      availableUnits: [
        MeasurementUnit.METRES,
        MeasurementUnit.MILLIMETRES,
        MeasurementUnit.FEET,
      ],
      defaultUnit: MeasurementUnit.MILLIMETRES,
    },
    {
      field: "data2",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],

  4137: [
    {
      field: "data1",
      name: "Rain Fall",
      availableUnits: [
        MeasurementUnit.METRES,
        MeasurementUnit.MILLIMETRES,
        MeasurementUnit.FEET,
      ],
      defaultUnit: MeasurementUnit.MILLIMETRES,
    },
    {
      field: "data2",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],

  4181: [
    {
      field: "data1",
      name: "External Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    },
    {
      field: "data2",
      name: "Internal Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],
  // MULTI PROFILE SOIL MOISTURE 
  // 4161 = SINGLE SENSOR
  // 41612 = TWO SENSOR
  // 41615 = FIVE SENSOR ETC
  4161: [
    {
      field: "s1",
      name: "Moisture",
      availableUnits: [
        MeasurementUnit.MILLIMETRES,
        MeasurementUnit.CENTIMETRES
      ],
      defaultUnit: MeasurementUnit.PERCENT,
    },
    {
      field: "s1t",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    },
    {
      field: "s11t",
      name: "Logger Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],
  41612: [
    {
      field: "s1",
      name: "Moisture",
      availableUnits: [
        MeasurementUnit.MILLIMETRES,
        MeasurementUnit.CENTIMETRES
      ],
      defaultUnit: MeasurementUnit.PERCENT,
    },
    {
      field: "s2",
      name: "Moisture",
      availableUnits: [
        MeasurementUnit.MILLIMETRES,
        MeasurementUnit.CENTIMETRES
      ],
      defaultUnit: MeasurementUnit.PERCENT,
    },
    {
      field: "s1t",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    },
    {
      field: "s2t",
      name: "Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    },
    {
      field: "s11t",
      name: "Logger Temperature",
      availableUnits: [
        MeasurementUnit.CELSIUS,
        MeasurementUnit.FAHRENHEIT
      ],
      defaultUnit: MeasurementUnit.CELSIUS,
    }
  ],
};