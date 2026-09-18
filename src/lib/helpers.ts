export function createRdsCurrentTimeStamp(){
    const now = new Date();
    const isoString = now.toISOString();
    const mysqlTimestamp = isoString.slice(0, 19).replace('T', ' ');

    return mysqlTimestamp;
}

  export function calculateSlope(Y1:number, Y2:number, X1:number, X2:number) {
    let slope = (Y2 - Y1) / (X2 - X1);
    return slope;
  };

  export function calculateOffset (Y1:number , M: number, X1:number) {
    let offset = Y1 - M * X1;
    return offset;
  };

  export function roundUp(num:number, precision:number) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  }
  
 export function roundUpResolution(num:number, precision:number) {
	num = Math.sqrt(Math.pow(num,2)); //Ensure the number is positive.
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  }

//   export function calculateAverage (array) {
//     let total = 0;
//     array.forEach(function(element) {
//       total = total + element;
//     });
//     let average = total / array.length;
//     return average;
//   };
