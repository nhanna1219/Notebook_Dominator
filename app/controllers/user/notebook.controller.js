"use strict";

class NotebookController {
    async index(req, res) {
        try {
            res.render("user/notebook/index");
        } catch (error) {
            console.error('Error rendering page:', error);
            res.status(500).send("An error occurred");
        }
    }

}

module.exports = new NotebookController();
