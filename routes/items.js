const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", function (req, res) {
  res.json({ items });
});

router.post("/", function (req, res, next) {
  if (!req.body.name) {
    throw new ExpressError("must contain information", 402);
  }
  try {
    const data = req.body;
    items.push(data);
    return res.json({ added: data });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", function (req, res, next) {
  try {
    const item = items.find((item) => item.name === req.params.name);
    if (item === undefined) throw new ExpressError("no such item", 404);
    return res.json({
      name: item.name,
      price: item.price,
    });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", function (req, res, next) {
  try {
    const item = items.find((item) => item.name === req.params.name);
    if (item === undefined) throw new ExpressError("no such item", 404);
    if (!req.body.name || !req.body.price) {
      throw new ExpressError("missing (items' name or price)", 402);
    }
    item.name = req.body.name;
    item.price = req.body.price;
    return res.status(201).json({ updated: item });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", function (req, res, next) {
  try {
    const item = items.find((item) => item.name === req.params.name);
    if (item === undefined) throw new ExpressError("no such item", 404);
    items.splice(item, 1);
    return res.json({ message: "Deleted" });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
