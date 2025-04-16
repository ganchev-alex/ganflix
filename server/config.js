"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbFolderPath = path_1.default.resolve(__dirname, "../../database");
if (!fs_1.default.existsSync(dbFolderPath)) {
    fs_1.default.mkdirSync(dbFolderPath, { recursive: true });
}
const databasePath = path_1.default.join(dbFolderPath, "ganflix-db.sqlite");
exports.sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: databasePath,
    logging: false,
});
exports.default = exports.sequelize;
