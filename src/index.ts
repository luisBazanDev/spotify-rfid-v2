import express from "express";

// Routes
import auth from "./routes/AuthRouter";
import test from "./routes/TestRouter";
import api from "./routes/ApiRouter";
import main from "./routes/MainRouter";

const app = express();

// Middlewares
app.use(express.static("public"));

app.use("/auth", auth);
app.use("/test", test);
app.use("/api", api);
app.use("/", main);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
