"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Series = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class Series extends sequelize_1.Model {
}
exports.Series = Series;
const { UUID, STRING, TEXT, INTEGER, DATE } = sequelize_1.DataTypes;
Series.init({
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    title: {
        type: STRING,
        allowNull: false,
    },
    description: {
        type: TEXT,
        allowNull: false,
    },
    seasons: {
        type: INTEGER,
        allowNull: false,
    },
    poster_src: {
        type: STRING(512),
        allowNull: false,
    },
    thumb_src: {
        type: STRING(512),
        allowNull: false,
    },
    release_date: {
        type: DATE,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    modelName: "Series",
    tableName: "series",
});
exports.default = Series;
