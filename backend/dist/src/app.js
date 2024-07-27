"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const setup_1 = __importDefault(require("./middleware/setup"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
require("dotenv").config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(setup_1.default);
app.use(routes_1.default);
app.use(errorHandler_1.default);
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    });
}
exports.default = app;
