"use strict";
class HomeController {
    async index(req, res) {
        try {
            res.render('user/home/index', { user: req.user });
    } catch (err) {
            console.error(err);
            res.redirect("/500");
        }
    }
}

module.exports = new HomeController();
