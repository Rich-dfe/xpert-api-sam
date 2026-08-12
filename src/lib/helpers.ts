export function createRdsCurrentTimeStamp(){
    const now = new Date();
    const isoString = now.toISOString();
    const mysqlTimestamp = isoString.slice(0, 19).replace('T', ' ');

    return mysqlTimestamp;
}