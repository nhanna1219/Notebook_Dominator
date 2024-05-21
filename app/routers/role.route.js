const router = require("express").Router();
const roleCtrl = require("../controllers/admin/role.controller");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
module.exports = (app) => {
  // Role
  router.get("/", roleCtrl.index);
  router.post("/", roleCtrl.create);
  router.put("/:id", roleCtrl.update);
  router.delete("/:id", roleCtrl.delete);

  // User
  router.get("/users", roleCtrl.getUsers);
  router.post('/users', (req, res) => roleCtrl.createUser(req, res));
  router.put("/users/:id", roleCtrl.updateUser);
  router.delete("/users/:id", roleCtrl.deleteUser);
  app.use("/role", ensureAuthenticated, router);
};
