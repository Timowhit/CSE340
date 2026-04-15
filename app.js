const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const utilities = require("./utilities/");
const indexRouter = require("./routes/index");
const inventoryRouter = require("./routes/inventoryRoute");
const accountRouter = require("./routes/accountRoute"); // ← NEW

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Session & Flash Middleware ----
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  }),
);
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.notice = req.flash("notice");
  next();
});

// ---- Routes ----
app.use("/", indexRouter);
app.use("/inv", inventoryRouter);
app.use("/account", accountRouter); // ← NEW

// ---- 404 Handler ----
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// ---- Error Handling Middleware ----
app.use(async (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred.";
  console.error(`Error ${status}: ${message}`);
  let nav = await utilities.getNav();
  res.status(status).render("errors/error", {
    title: status === 404 ? "404 – Page Not Found" : "500 – Server Error",
    message,
    status,
    nav,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

module.exports = app;
