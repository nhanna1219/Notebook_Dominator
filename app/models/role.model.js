"use strict";
const { generateRandomPassword, hashPassword } = require("../utils/passwordUtils");
const sql = require("./db");
class Role {
  constructor(role) {
    this.name = role?.name;
    this.is_active = role?.is_active;
  }
}

class RoleService {
  static async insert(role) {
    try {
      const [res] = await sql.promise().query("INSERT INTO roles SET ?", [role]);
      console.log("Inserted:", { id: res.insertId, ...role });
      return { id: res.insertId, ...role };
    } catch (err) {
      console.error("Error on insert:", err);

      // Check for duplicate entry error
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        return { error: "Duplicate entry", details: err.sqlMessage };
      }
      throw err;
    }
  }

  static async getById(id) {
    try {
      const [res] = await sql.promise().query("SELECT * FROM roles WHERE id = ?", [id]);
      if (res.length) {
        console.log("Found:", res[0]);
        return res[0];
      } else {
        throw new Error("Role not found");
      }
    } catch (err) {
      console.error("Error on get by id:", err);
      throw err; // Rethrow to allow caller to handle
    }
  }

  static async getUsers() {
    try {
      const query = `
      SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.username, 
          u.is_active, 
          r.name AS role_name, 
          s.title AS subject_name
      FROM 
          users u
          JOIN roles r ON u.role_id = r.id
          LEFT JOIN subjects s ON s.id = u.subject_id
      ORDER BY 
          u.id;
    `;
      const users = await sql.promise().query(query);
      return {
        data: users[0]
      };
    } catch (err) {
      console.error("Error on get users:", err);
      throw err;
    }
  }

  static async getRoles(roleName) {
    try {
      const query = roleName ?
        "SELECT * FROM roles WHERE name LIKE ?" :
        "SELECT * FROM roles";
      const params = roleName ? [`%${roleName}%`] : [];
      const [res] = await sql.promise().query(query, params);
      return res;
    } catch (err) {
      console.error("Error on get roles:", err);
      throw err;
    }
  }

  static async update(id, role) {
    try {
      const [res] = await sql.promise().query("UPDATE roles SET ? WHERE id = ?", [role, id]);
      if (res.affectedRows == 0) {
        throw new Error("Role not found");
      }
      console.log("Updated:", { id, ...role });
      return { id, ...role };
    } catch (err) {
      console.error("Error on update:", err);

      // Check for duplicate entry error
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        return { error: "Duplicate entry", details: err.sqlMessage };
      }
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [res] = await sql.promise().query("DELETE FROM roles WHERE id = ?", [id]);
      if (res.affectedRows == 0) {
        throw new Error("Role not found");
      }
      console.log("Deleted with id:", id);
      return res;
    } catch (err) {
      console.error("Error on delete:", err);
      throw err;
    }
  }

  static async createUser(userData) {
    const { lastName, firstName, email, username, role, subject } = userData;
    const randomPassword = generateRandomPassword(8);
    const hashedPassword = await hashPassword(randomPassword);
    try {
      const [result] = await sql.promise().query(
        "INSERT INTO users (first_name, last_name, email, username, password, role_id, subject_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, username, hashedPassword, role, subject]
      );
      if (result.affectedRows == 0) {
        throw new Error("Can't Insert User");
      }
      const roleQuery = "SELECT name FROM roles WHERE id = ?";
      const subjectQuery = "SELECT title FROM subjects where id = ?";
      const [[roleResult], [subjectResult]] = await Promise.all([
        sql.promise().query(roleQuery, [role]),
        sql.promise().query(subjectQuery, [subject])
      ]);

      console.log(randomPassword);
      return { 
        userId: result.insertId, 
        role: roleResult[0].name,
        subject: subjectResult[0]?.title,
        password: randomPassword
      };
    } catch (error) {
      console.error('Failed to insert user:', error);

      // Check for duplicate username or email
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.sqlMessage.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  static async updateUser(id, userData) {
    const { lastName, firstName, email, username, role, subject } = userData;
    try {
      const updateQuery = "UPDATE users SET first_name = ?, last_name = ?, email = ?, username = ?, role_id = ?, subject_id = ? WHERE id = ?";
      const [result] = await sql.promise().query(updateQuery, [firstName, lastName, email, username, role, subject, id]);
  
      if (result.affectedRows == 0) {
        throw new Error("No rows affected, user not found or data is the same");
      }
  
      const roleQuery = "SELECT name FROM roles WHERE id = ?";
      const subjectQuery = "SELECT title FROM subjects where id = ?";
      const [[roleResult], [subjectResult]] = await Promise.all([
        sql.promise().query(roleQuery, [role]),
        sql.promise().query(subjectQuery, [subject])
      ]);
  
      return { 
        status: 1,
        role: roleResult[0].name,
        subject: subjectResult[0]?.title
      };
    } catch (error) {
      console.error('Failed to update user:', error);

      // Check for duplicate username or email
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.sqlMessage.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const [res] = await sql.promise().query("DELETE FROM users WHERE id = ?", [id]);
      if (res.affectedRows == 0) {
        throw new Error("User not found");
      }
      console.log("Deleted with id:", id);
      return res;
    } catch (err) {
      console.error("Error on delete:", err);
      throw err;
    }
  }
}

module.exports = { Role, RoleService };
