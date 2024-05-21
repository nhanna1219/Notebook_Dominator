"use strict";
const { Role, RoleService } = require("../models/role.model");
const { User, UserService } = require("../models/user.model");

class RoleCtrl {
  index(req, res) {
    res.locals.deleted = req.query.deleted;
    const roleName = req.query.roleName;
    let fetchUser;
    RoleService.get()
      .then((result) => {
        fetchUser = result;
        console.log(fetchUser); // Xử lý kết quả ở đây
      })
      .catch((err) => {
        console.log(err); // Xử lý lỗi ở đây nếu có
      });
    console.log("đây là res", fetchUser);
    // RoleService.get((err, data) => {
    //   if (err) res.redirect("/500");
    //   else {
    //     console.log(data);
    //     res.render("role/index", { users: data });
    //   }
    // });
    RoleService.getAll(roleName, (err, data) => {
      if (err) res.redirect("/500");
      else {
        // console.log(data);
        res.render("role/index", { roles: data, users: fetchUser });
      }
    });
  }

  showFormCreate(req, res) {
    res.locals.status = req.query.status;
    res.render("role/create");
  }

  create(req, res) {
    if (!req.body) {
      res.redirect("role/create?status=error");
    }
    const newRole = new Role(req.body);
    RoleService.insert(newRole, (err, result) => {
      if (err) res.redirect("/role/create?status=error");
      else {
        console.log(result);
        res.redirect("/role");
      }
    });
  }

  showFormEdit(req, res) {
    res.locals.status = req.query.status;
    RoleService.getById(req.params.id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.redirect("/404");
        } else {
          res.redirect("/500");
        }
      } else res.render("role/edit", { role: result });
    });
  }

  update(req, res) {
    const newRole = new Role(req.body);
    RoleService.update(req.params.id, newRole, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.redirect("/404");
        } else {
          res.redirect("/500");
        }
      } else {
        res.redirect("/role");
      }
    });
  }

  delete(req, res) {
    RoleService.delete(req.params.id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.redirect("/404");
        } else {
          res.redirect("/500");
        }
      } else res.redirect("/role?deleted=true");
    });
  }
}

module.exports = new RoleCtrl();
