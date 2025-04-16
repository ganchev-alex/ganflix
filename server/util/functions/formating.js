"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTitle = void 0;
const convertTitle = function (title) {
    return title
        .replace(/:/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .toLowerCase()
        .split(" ")
        .join("_");
};
exports.convertTitle = convertTitle;
