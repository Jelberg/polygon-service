import express from "express";
import routerApi from "../routes"

export const app = express();
const port = 3000;


app.listen(port, () =>{
    console.log("My port: " + port);
  });

routerApi(app)