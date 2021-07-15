import { ObjectID, ObjectId } from 'bson';
import { Request, Response } from 'express';
import config from '../config';
import * as db_pool from '../db';
import jwt from 'jsonwebtoken';

export class AuthController {

    public async authorize(req: Request, res: Response, next: any) {

        var data: any = {
            userId: req.headers['xx-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress, 
            username: 'Benedikt', 
            role: 'user'
        };

        req.query.jwt = data;
        next();

        // var authToken = req.headers['authorization']?.replace('Bearer ', '');

        // if (typeof authToken !== 'undefined')
        //     jwt.verify(authToken, config.private_key, (err, decoded) => {
        //         if (err)
        //         {
        //             res.sendStatus(401);
        //         }
        //         else
        //         {
        //             var data: any = decoded;
        //             req.query.jwt = data;
        //             next();
        //         }
        //     });
        // else
        // {
        //     res.sendStatus(401);
        // }
    }

    public async getInfo(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        res.json(data);
    }

}