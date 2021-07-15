import { ObjectID, ObjectId } from 'bson';
import { Request, Response } from 'express';
import config from '../config';
import * as db_pool from '../db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class UserController {

    public async getUsers(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('user');

        col.find(
            {

            }
        ).project(
            {
                password: 0,
                picture: 0
            }
        ).toArray()
        .then(data => {
            res.json(data);
        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        });
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('user');

        let _id;
        
        try
        {
            _id = new ObjectId(req.params.user);
        }
        catch(e)
        {
            res.sendStatus(400);
            return;
        }

        col.findOne(
            {
                _id
            },
            { 
                projection: 
                {
                    password: 0,
                    picture: 0
                } 
            }
        ).then(data => {
            res.json(data);
        }).catch(error => {
            res.sendStatus(404);
        }).finally(() => {
            client.close();
        });
    }

    public async postRegister(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('user');

        col.findOne(
            {
                username: req.body.username
            }
        ).then(async data => {

            if(!data)
            {
                const client2 = await db_pool.getConnection().connect();
                const db = client2.db('picturebea');
                const col = db.collection('user');
                
                var hash = crypto.createHash('sha512').update(req.body.password).digest('hex');
    
                col.insertOne(
                    {
                        username: req.body.username,
                        password: hash,
                        role: 'user'
                    }
                ).then(data => {

                    var token = jwt.sign
                    (
                        {
                            userId: data.insertedId,
                            username: req.body.username,
                            role: 'user'
                        },
                        config.private_key,
                        { 
                            expiresIn: '100h'
                        }
                    );

                    res.json({
                        userId: data.insertedId,
                        token
                    });

                }).catch(error => {
                    res.sendStatus(500);
                }).finally(() => {
                    client2.close();
                });
            }
            else
            {
                res.sendStatus(403);
            }

        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        });
    }

    public async postLogin(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('user');

        col.findOne(
            {
                username: req.body.username
            }
        ).then(async data => {

            if(data)
            {
                var hash = crypto.createHash('sha512').update(req.body.password).digest('hex');

                if(data.password == hash)
                {
                    var token = jwt.sign
                    (
                        {
                            userId: data._id,
                            username: data.username,
                            role: data.role
                        },
                        config.private_key,
                        { 
                            expiresIn: '100h'
                        }
                    );

                    res.json({
                        token
                    });
                }
                else
                {
                    res.sendStatus(403);
                }
            }
            else
            {
                res.sendStatus(404);
            }

        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        });
    }
}