import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '../controllers/authController';
import { PostController } from '../controllers/postController';

export class PostRoutes {

    public router: Router;
    public controller: PostController = new PostController();
    public authorizer: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes():void {
        this.router.get("/all", this.authorizer.authorize, this.controller.getPosts);
        
        this.router.get("/:post", this.authorizer.authorize, this.controller.getPost);
        this.router.get("/:post/img", this.controller.getImg);

        this.router.post("/", this.authorizer.authorize, multer().single('picture'), this.controller.postPost);
        this.router.put("/", this.authorizer.authorize, this.controller.putPost);
        this.router.delete("/:post", this.authorizer.authorize, this.controller.deletePost);

        this.router.post("/:post/comment", this.authorizer.authorize, this.controller.postComment);
        this.router.delete("/:post/comment/:comment", this.authorizer.authorize, this.controller.deleteComment);

        this.router.post("/:post/like", this.authorizer.authorize, this.controller.postLike);
    }
}
