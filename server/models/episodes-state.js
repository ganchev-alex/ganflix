"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesState = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class EpisodesState extends sequelize_1.Model {
}
exports.EpisodesState = EpisodesState;
const { STRING, INTEGER, UUID } = sequelize_1.DataTypes;
EpisodesState.init({
    state_id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    episode_id: {
        type: STRING,
        allowNull: false,
        references: {
            model: "Episode",
            key: "id",
        },
    },
    series_id: {
        type: STRING,
        allowNull: false,
        references: {
            model: "Series",
            key: "id",
        },
    },
    currant_time: {
        type: INTEGER,
        allowNull: false,
    },
    total_duration: {
        type: INTEGER,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    modelName: "EpisodesState",
    tableName: "episodes_state",
});
exports.default = EpisodesState;
