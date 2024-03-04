const express = require("express");

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    res.render('index', { data: { title: "Web Crawler" } });
});

module.exports = indexRouter;
