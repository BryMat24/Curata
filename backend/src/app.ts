import express from "express";
import router from "./routes";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import setupAPIKey from "./middleware/setup";

const app = express();
const PORT = 3002;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(setupAPIKey);
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});
