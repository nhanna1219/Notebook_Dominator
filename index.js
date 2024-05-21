require("dotenv/config");
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const path = require('path');
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT || 3000;  // Use environment variable for port

// Webpack
const webpack = require('webpack');
const config = require('./webpack.config.js');
const compiler = webpack(config);

const webpackDevMiddleware = require('webpack-dev-middleware');

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    writeToDisk: true,
    stats: 'minimal',
}));

// Passport Configuration
require("./app/config/passport")(passport);


// Setting up Express and EJS
app.set("view engine", "ejs");
app.set("views", "app/views");
app.use(express.static("app/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override for supporting "_method" override
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware setup
app.use(flash());

// Custom method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

const { ensureAuthenticated, forwardAuthenticated } = require("./app/config/auth");
// Routes
require("./app/routers")(app);

app.get("/", forwardAuthenticated ,(req, res) => res.render("login"));
app.get('/logout',function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
app.get("/500", (req, res) => res.render("err"));
app.get("/404", (req, res) => res.render("404"));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
