"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class Movie extends sequelize_1.Model {
}
exports.Movie = Movie;
const { UUID, STRING, TEXT, INTEGER, DATE } = sequelize_1.DataTypes;
Movie.init({
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
    duration: {
        type: INTEGER,
        allowNull: false,
    },
    release_date: {
        type: DATE,
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
    modelName: "Movie",
    tableName: "movies",
});
exports.default = Movie;
