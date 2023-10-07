const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/items", itemsRoutes);

app.use((req, res) => {
  return new ExpressError("not found", 404);
});

/**Error handler */
app.use((err, req, res, next) => {
  let status = err.status;

  console.error("error", {
    message: err.msg,
    status,
  });

  return res.status(status).json({
    message: err.msg,
    status,
  });
});

module.exports = app;
