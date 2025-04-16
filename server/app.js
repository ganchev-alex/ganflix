"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
require("./models/associations-init");
const explore_1 = __importDefault(require("./routes/explore"));
const movies_1 = __importDefault(require("./routes/movies"));
const series_1 = __importDefault(require("./routes/series"));
const episodes_1 = __importDefault(require("./routes/episodes"));
const genres_1 = __importDefault(require("./routes/genres"));
const listings_1 = __importDefault(require("./routes/listings"));
const collections_1 = __importDefault(require("./routes/collections"));
const state_1 = __importDefault(require("./routes/state"));
const personalization_1 = __importDefault(require("./controllers/personalization"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ type: "application/json" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return next();
});
app.use("/explore", explore_1.default);
app.use("/movies", movies_1.default);
app.use("/series", series_1.default);
app.use("/episodes", episodes_1.default);
app.use("/genres", genres_1.default);
app.use("/listings", listings_1.default);
app.use("/collections", collections_1.default);
app.use("/state", state_1.default);
app.post("/personalization", (req, res) => {
    (0, personalization_1.default)(req, res);
});
app.use("/source", express_1.default.static(path_1.default.resolve(__dirname, "../..", "database", "content")));
app.use("/assets", express_1.default.static(path_1.default.resolve(__dirname, "../..", "database", "client-assets")));
const initServer = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield config_1.default.authenticate();
            yield config_1.default.sync();
            app.listen(8080, () => {
                console.log("Server initialized succesfully. Server is running locally on port 8080.");
            });
        }
        catch (error) {
            console.log("Unsuccesful connection to the database.\n", error);
        }
    });
};
initServer();
