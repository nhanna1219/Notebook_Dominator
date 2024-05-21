require("dotenv/config");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "app/views");
app.use(express.static("app/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/500", (req, res) => {
  res.render("err");
});
app.get("/404", (req, res) => {
  res.render("404");
});

require("./app/routers")(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
