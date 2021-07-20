// Require node packages
const express = require("express");
const handlebars = require("express-handlebars");

// Set up express app and environment
const app = express();
require("dotenv").config();
const config = require("./config.json")[process.env.NODE_ENV || "development"];
app.listen(config.port, () => {
  console.log(`Application listening to port ${config.port}...`);
});

// Set up postgres database connection using knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

// Serve public folder and set up middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up passport strategy
const flash = require("express-flash");
app.use(flash());
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
require("./userAuth/passportSetup")(app);

// Set up note and page service and router
const NoteService = require("./server/noteService");
const noteService = new NoteService(knex);
const NoteRouter = require("./server/noteRouter");
const noteRouter = new NoteRouter(noteService).router();
const PageRouter = require("./server/pageRouter");
const pageRouter = new PageRouter(knex, noteService).router();

// Page routes
app.use("/", pageRouter);

// Note routes
app.use("/api/notes/", noteRouter);
