import express from "express";

// Routes
import auth from "./routes/AuthRouter";
import test from "./routes/TestRouter";
import api from "./routes/ApiRouter";

const app = express();

app.use("/auth", auth);
app.use("/test", test);
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
