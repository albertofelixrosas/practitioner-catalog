import express, { Application } from 'express';
import cors from 'cors';

import db from '../db/connection';
import practitionersRoutes from '../routes/practitioners';
import schedulesRoutes from '../routes/schedules';

class Server {
    private app: Application;
    private port: string;
    private apiPaths = {
        schedules: '/schedules',
        practitioners: '/practitioners',
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database online');
        } catch (e: any) {
            throw new Error(e);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.apiPaths.practitioners, practitionersRoutes);
        this.app.use(this.apiPaths.schedules, schedulesRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server at port ${this.port}`);
            console.log(`http://localhost:${this.port}/`);
        });
    }
}

export default Server;
