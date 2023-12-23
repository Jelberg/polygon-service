import express from "express";
import routerApi from "../routes"
import { env } from "../enviroments";

export const app = express();

app.listen(env.port, () =>{
    console.log("My port: " + env.port);
  });

routerApi(app)