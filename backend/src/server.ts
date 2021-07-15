import express, { request } from 'express';
import compression from 'compression';
import cors from 'cors';
import config from './config';
import * as db from './db';
import { PostRoutes } from './routes/postRoutes';
import { UserRoutes } from './routes/userRoutes';

export class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.start();
    }

    public config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(compression());
        this.app.use(cors());
    }

    public routes(): void {
        this.app.use("/api/post", new PostRoutes().router);
        this.app.use("/api/user", new UserRoutes().router);
    }

    public start(): void {
        this.app.listen(config.port, () => {
            console.log("Picturebea Backend läuft auf Port "+config.port);
        });
        this.app.get('*', (req, res) => {
            res.sendStatus(404);
        });
        this.app.post('*', (req, res) => {
            res.sendStatus(404);
        });
    }
}