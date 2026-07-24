import { RowDataPacket } from "mysql2";

export interface Logger extends RowDataPacket {
    id: number;
    loggerName: string;
    productId: number;
    loggerUid: number;
}