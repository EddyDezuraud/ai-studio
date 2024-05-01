import { Router } from "express";
import { styleConfig } from "../config/styleConfig";

Router.get("/", async(req, res) => {
    const data = await styleConfig();
    res.json(data);
});