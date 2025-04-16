"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const state_1 = __importDefault(require("../controllers/state"));
const router = express_1.default.Router();
router.post("/manage", (req, res) => {
    state_1.default.manageState(req, res);
});
router.get("/watching", (req, res) => {
    state_1.default.getWatching(req, res);
});
exports.default = router;
