"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Episode = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class Episode extends sequelize_1.Model {
}
exports.Episode = Episode;
const { UUID, STRING, INTEGER } = sequelize_1.DataTypes;
Episode.init({
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    series_id: {
        type: UUID,
        allowNull: false,
        references: {
            model: "Series",
            key: "id",
        },
    },
    title: {
        type: STRING,
        allowNull: false,
    },
    season: {
        type: INTEGER,
        allowNull: false,
    },
    episode_num: {
        type: INTEGER,
        allowNull: false,
    },
    stream_src: {
        type: STRING(512),
        allowNull: false,
    },
    en_subtitles: {
        type: STRING(512),
        allowNull: true,
    },
    bg_subtitles: {
        type: STRING(512),
        allowNull: true,
    },
}, {
    sequelize: config_1.default,
    modelName: "Episode",
    tableName: "episodes",
});
exports.default = Episode;
