import styleConfig from "../services/styleAnalyzerService";
import { Router } from 'express';

const router: Router = Router();

router.get("/", async(req, res) => {
    const url = new URL(req.query.url as string);
    const data = await styleConfig(url);
    res.json(data);
});

export default router;