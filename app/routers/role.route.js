const router = require("express").Router();
const roleCtrl = require("../controllers/role.controller");

module.exports = (app) => {
  router.get("/", roleCtrl.index);
  router.get("/create", roleCtrl.showFormCreate);
  router.post("/", roleCtrl.create);
  router.get("/delete/:id", roleCtrl.delete);
  router.put("/:id", roleCtrl.update);
  router.get("/edit/:id", roleCtrl.showFormEdit);

  app.use("/role", router);
};
