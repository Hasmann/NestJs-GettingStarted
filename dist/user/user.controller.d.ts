/// <reference types="passport" />
import { Request } from 'express';
export declare class Users {
    constructor();
    getMe(req: Request): Express.User;
}
