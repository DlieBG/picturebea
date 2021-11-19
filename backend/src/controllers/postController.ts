import { ObjectID, ObjectId } from 'bson';
import { Request, Response } from 'express';
import config from '../config';
import * as db_pool from '../db';
import sharp from 'sharp';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

export class PostController {

    public async getPosts(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        col.find(
            {

            }
        ).project(
            {
                picture: 0
            }
        ).sort(
            {
                _id: -1
            }
        )
        .toArray()
        .then(data => {
            res.json(data);
        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        });
    }

    public async getPost(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let _id;
        
        try
        {
            _id = new ObjectId(req.params.post);
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
                projection: { picture: 0 }
            }
        ).then(data => {
            res.json(data);
        }).catch(error => {
            res.sendStatus(404);
        }).finally(() => {
            client.close();
        });
    }

    public async getImg(req: Request, res: Response): Promise<void> {
        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let _id;
        
        try
        {
            _id = new ObjectId(req.params.post);
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
                projection: { picture: 1 }
            }
        ).then(data => {
            res.end(data.picture.buffer);
        }).catch(error => {
            res.sendStatus(404);
        }).finally(() => {
            client.close();
        });        
    }

    public async postPost(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let picture = req.file.buffer

        try
        {            
            let meta = await sharp(picture)
                .metadata();

            picture = await sharp(picture)
                .resize(600, 600)
                .toBuffer();

            console.log(meta.orientation)
            switch(meta.orientation)
            {
                case 8:
                    picture = await sharp(picture)
                        .resize(600, 600)
                        .rotate(180)
                        .toBuffer();

                case 6:
                    picture = await sharp(picture)
                        .resize(600, 600)
                        .rotate(270)
                        .toBuffer();

                case 3:
                    picture = await sharp(picture)
                        .resize(600, 600)
                        .rotate(180)
                        .toBuffer();
            }
        }
        catch(e)
        {
            res.sendStatus(400);
            return;
        }

        let ai = {};
        
        if(config.ai_key != '' && config.ai_endpoint != '') {
            const key = config.ai_key;
            const endpoint = config.ai_endpoint;
            const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
            ai = await computerVisionClient.analyzeImageInStream(picture, { visualFeatures: ['Tags', 'Description', 'Adult', 'Objects', 'Brands', 'Faces'] });

            console.log(ai)
        }

        col.insertOne(
            {
                user: data.userId,
                caption: req.body.caption,
                picture: picture,
                ai,
                comments: [],
                likes: []
            }
        ).then(data => {
            res.json({
                postId: data.insertedId
            });
        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        });
    }

    public async putPost(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let _id;
        
        try
        {
            _id = new ObjectId(req.body._id);
        }
        catch(e)
        {
            res.sendStatus(400);
            return;
        }
        
        if(data.role == 'admin')
            col.updateOne(
                {
                    _id
                }, 
                {
                    $set:
                    {
                        caption: req.body.caption
                    }
                }
            ).then(data => {
                res.json({
                    ok: data.result.nModified
                });
            }).catch(error => {
                res.sendStatus(404);
            }).finally(() => {
                client.close();
            });       
        else
            col.updateOne(
                {
                    _id,
                    user: data.userId
                }, 
                {
                    $set:
                    {
                        caption: req.body.caption
                    }
                }
            ).then(data => {
                res.json({
                    ok: data.result.nModified
                });
            }).catch(error => {
                res.sendStatus(404);
            }).finally(() => {
                client.close();
            });        
    }

    public async deletePost(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');
        
        let _id;
        
        try
        {
            _id = new ObjectId(req.params.post);
        }
        catch(e)
        {
            res.sendStatus(400);
            return;
        }

        if(data.role == 'admin')
            col.deleteOne(
                {
                    _id
                }
            ).then(data => {
                res.json({
                    ok: data.result.n
                });
            }).catch(error => {
                res.sendStatus(404);
            }).finally(() => {
                client.close();
            });  
        else
            col.deleteOne(
                {
                    _id,
                    user: data.userId
                }
            ).then(data => {
                res.json({
                    ok: data.result.n
                });
            }).catch(error => {
                res.sendStatus(404);
            }).finally(() => {
                client.close();
            });        
    }

    public async postComment(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let _id;
        
        try
        {
            _id = new ObjectId(req.params.post);
        }
        catch(e)
        {
            res.sendStatus(400);
            return;
        }
        
        col.updateOne(
            {
                _id
            }, 
            {
                $push: 
                {
                    comments: 
                    {
                        _id: new ObjectId(),
                        user: data.userId,
                        text: req.body.text
                    }
                }
            }
        ).then(data => {
            res.json({
                ok: data.result.nModified
            });
        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        });
    }

    public async deleteComment(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let _id;
        
        try
        {
            _id = new ObjectId(req.params.post);
        }
        catch(e)
        {
            res.sendStatus(400);
            return;
        }

        if(data.role == 'admin')        
            col.updateOne(
                {
                    _id
                }, 
                {
                    $pull: 
                    {
                        comments: 
                        {
                            _id: new ObjectId(req.params.comment)
                        }
                    }
                }
            ).then(data => {
                res.json({
                    ok: data.result.nModified
                });
            }).catch(error => {
                res.sendStatus(404);
            }).finally(() => {
                client.close();
            });
        else
            col.updateOne(
                {
                    _id
                }, 
                {
                    $pull: 
                    {
                        comments: 
                        {
                            _id: new ObjectId(req.params.comment),
                            user: data.userId
                        }
                    }
                }
            ).then(data => {
                res.json({
                    ok: data.result.nModified
                });
            }).catch(error => {
                res.sendStatus(404);
            }).finally(() => {
                client.close();
            });
    }

    public async postLike(req: Request, res: Response): Promise<void> {
        var data: any = req.query.jwt;

        const client = await db_pool.getConnection().connect();
        const db = client.db('picturebea');
        const col = db.collection('post');

        let _id: ObjectId;
        let user: string;
        
        try
        {
            _id = new ObjectId(req.params.post);
            user = data.userId;
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
                projection: { likes: 1 }
            }
        ).then(async data => {
            const client2 = await db_pool.getConnection().connect();
            const db2 = client2.db('picturebea');
            const col2 = db2.collection('post');

            if(data.likes.includes(user))
            {
                col2.updateOne(
                    {
                        _id
                    },
                    {
                        $pull:
                        {
                            likes: user
                        }
                    }
                ).then(data => {
                    res.json({
                        ok: data.result.nModified
                    });
                }).catch(error => {
                    res.sendStatus(500);
                }).finally(() => {
                    client2.close();
                });
            }
            else
            {
                col2.updateOne(
                    {
                        _id
                    },
                    {
                        $push:
                        {
                            likes: user
                        }
                    }
                ).then(data => {
                    res.json({
                        ok: data.result.nModified
                    });
                }).catch(error => {
                    res.sendStatus(500);
                }).finally(() => {
                    client2.close();
                });
            }
        }).catch(error => {
            res.sendStatus(500);
        }).finally(() => {
            client.close();
        })
    }
}