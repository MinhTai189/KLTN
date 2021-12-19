const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

const statisticalRoute = (io) => {
  router.get("/motels", (req, res) => {});
};

module.exports = statisticalRoute;
