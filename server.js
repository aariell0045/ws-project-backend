const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const mongooseURI = `mongodb://localhost/wsDB`;
// const mongooseURI = `mongodb+srv://toam:123987456tofo@ws.ppnha.mongodb.net/WS?retryWrites=true&w=majority`;
mongoose.connect(mongooseURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const api = require("./routes/api");

mongoose.connection
  .once("open", () => console.log("connected"))
  .on("error", (error) => {
    console.log("YOUR ERROR ", error);
  });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use("/", api);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
  console.log(`server is up and runing on port - ${PORT}`);
});
