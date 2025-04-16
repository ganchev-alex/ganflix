"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class State extends sequelize_1.Model {
}
exports.State = State;
const { UUID, STRING, INTEGER } = sequelize_1.DataTypes;
State.init({
    state_id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    resume_time: {
        type: INTEGER,
        allowNull: false,
    },
    total_duration: {
        type: INTEGER,
        allowNull: false,
    },
    movie_id: {
        type: STRING,
        allowNull: true,
        defaultValue: null,
    },
    series_id: {
        type: STRING,
        allowNull: true,
        defaultValue: null,
    },
    episode_id: {
        type: STRING,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: config_1.default,
    modelName: "State",
    tableName: "states",
    timestamps: false,
});
exports.default = State;
