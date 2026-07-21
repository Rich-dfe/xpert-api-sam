import { RowDataPacket } from "mysql2";

export interface Group extends RowDataPacket {
    id: number;
    userId: number;
    groupName: string;
    notes: string;
}