import {Router} from "express";

router.get("/", (req, res) => {
    res.send("Hello World!");
});