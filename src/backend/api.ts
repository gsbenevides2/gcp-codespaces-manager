import { Elysia } from "elysia";
import CodespacesController from "./controllers/Codespaces/Controller";

const api = new Elysia({
	prefix: "/api",
}).use(CodespacesController);

export default api;
