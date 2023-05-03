import { Router } from "express";
import parser from "../controller/parser.controller";
import image from "../controller/image.controller";

const router = Router();

router.post("/parse", parser);
router.post("/image", image);

export default router;
