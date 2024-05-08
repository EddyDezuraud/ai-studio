import styleConfig from "../services/styleAnalyzerService";
import { Router } from 'express';

const router: Router = Router();

router.get("/", async(req, res) => {
    console.log('router /styleConfig');

    const query = req.query.url as string;
    const mode = req.query.mode as 'url' | 'name';
    const lang = req.query.lang as string;
    const data = await styleConfig(query, mode, lang);
    res.json(data);
});

export default router;