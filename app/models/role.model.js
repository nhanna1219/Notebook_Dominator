"use strict";
const sql = require("./db");
// class User {
//   constructor(user){
//     this.firstName = user?.
//   }
// }
class Role {
  constructor(role) {
    this.name = role?.name;
    this.is_active = role?.is_active;
  }
}
// class BangDia {
//   constructor(bangDia) {
//     this.tenBangDia = bangDia?.tenBangDia;
//   }
// }

class RoleService {
  static insert(role, callback) {
    sql.query("INSERT INTO roles SET ?", role, (err, res) => {
      if (err) {
        console.log("err", err);
        callback(err, null);
        return;
      }
      console.log("inserted:", { id: res.insertId });
      callback(null, {
        id: res.insertId,
        ...role,
      });
    });
  }

  static getById(id, callback) {
    sql.query(`SELECT * FROM roles WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("err", err);
        callback(err, null);
        return;
      }
      if (res.length) {
        console.log("found: ", res[0]);
        callback(null, res[0]);
        return;
      }
      // not found with the id
      callback({ kind: "not_found" }, null);
    });
  }
  static get() {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT u.*, r.name AS role_name FROM users AS u JOIN roles AS r ON u.role_id = r.id";
      sql.query(query, (err, res) => {
        if (err) {
          console.log(err);
          reject(err); // Trả về lỗi nếu có lỗi xảy ra
          return;
        }
        if (res.length) {
          resolve(res); // Trả về kết quả nếu có dữ liệu được trả về
        } else {
          resolve([]); // Trả về mảng rỗng nếu không có dữ liệu
        }
      });
    });
  }
  static getAll(roleName, callback) {
    let query = "SELECT * FROM roles";
    let query_user =
      "Select u.*, r.name as role_name from users as u join roles r on u.role_id = r.id";
    if (roleName) {
      query += ` WHERE name LIKE '%${roleName}%'`;
    } // nếu có truyền vào tên thì sẽ tìm kiếm theo tên

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      // console.log("role: ", res);
      callback(null, res);
    });
  }

  static update(id, role, callback) {
    sql.query("UPDATE roles SET ? WHERE id = ?", [role, id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found  with the id
        callback({ kind: "not_found" }, null);
        return;
      }
      console.log("updated : ", { id: id, ...role });
      callback(null, { id: id, ...role });
    });
  }

  static delete(id, callback) {
    sql.query("DELETE FROM roles WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found with the id
        callback({ kind: "not_found" }, null);
        return;
      }
      console.log("deleted with id: ", id);
      callback(null, res);
    });
  }
}

module.exports = { Role, RoleService };
