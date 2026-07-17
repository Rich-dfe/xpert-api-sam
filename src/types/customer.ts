import { RowDataPacket } from "mysql2";

export interface Customer extends RowDataPacket {
    id: number;
    companyName: string;
}