require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db")
const models = require("./models/models")
const PORT = process.env.PORT || 5000;
// const importData = require("./data/importData") // перенос данных в Neon DB
const router = require("./routes/index")

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}

start()



