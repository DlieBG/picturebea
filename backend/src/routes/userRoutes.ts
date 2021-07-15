import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';

export class UserRoutes {

    public router: Router;
    public controller: UserController = new UserController();
    public authorizer: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes():void {
        this.router.get("/", this.authorizer.authorize, this.authorizer.getInfo);

        // this.router.get("/all", this.authorizer.authorize, this.controller.getUsers);
        
        // this.router.get("/:user", this.authorizer.authorize, this.controller.getUser);

        // this.router.post("/register", this.controller.postRegister);
        // this.router.post("/login", this.controller.postLogin);
    }
}
