const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const path = require("path");
const indexRouter = require("./routes/indexRouter.js");
const crawlerRouter = require("./routes/crawlerRouter.js");
const initialisePinecone = require("./crawler/initialisePinecone.js");
const queryRouter = require("./routes/queryRouter.js");

dotenv.config();
const PORT = process.env.PORT || 3005;
const ENV = process.env.ENV || 'dev';

initialisePinecone();
const app = express();

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(logger(ENV));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')));
app.use('/', indexRouter);
app.use('/crawl', crawlerRouter);
app.use('/query', queryRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));