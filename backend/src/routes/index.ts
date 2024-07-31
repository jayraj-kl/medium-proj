import { Hono } from "hono";
import { userRouter } from "./user";
import { bookRouter } from "./blog";

export const rootRouter = new Hono();

rootRouter.route('/user', userRouter)
rootRouter.route('/book', bookRouter)