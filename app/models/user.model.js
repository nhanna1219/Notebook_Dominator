"use strict";
const sql = require("./db");
const bcrypt = require("bcryptjs");

class User {
  constructor(user) {
    this.first_name = user?.first_name;
    this.last_name = user?.last_name;
    this.username = user?.username;
    this.password = user?.password;
    this.is_active = user?.is_active;
    this.role_id = user?.role_id;
  }
}

class UserService {
  static async getAll() {
    const query = "SELECT u.*, r.name as role_name FROM users AS u JOIN roles r ON u.role_id = r.id";
    try {
      const [results] = await sql.promise().query(query);
      return results;
    } catch (err) {
      console.error("Error fetching users: ", err);
      throw err;
    }
  }

  static async login(username, password) {
    const query = "SELECT u.id, u.first_name, u.last_name, u.username, u.password, r.id as role_id, r.name as role_name FROM users AS u JOIN roles r ON u.role_id = r.id WHERE u.username = ?";
    try {
      const [results] = await sql.promise().query(query, [username]);
      if (results.length === 0) {
        return -1; // not exist user name 
      }
      const user = results[0];
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return 0; // password is not valid
      }
      delete user.password;
      return user;
    } catch (err) {
      console.error("Login error: ", err);
      throw err;
    }
  }
  

  static async findById(id) {
    const query = "SELECT u.*, r.name as role_name FROM users AS u JOIN roles r ON u.role_id = r.id WHERE u.id = ?";
    try {
      const [results] = await sql.promise().query(query, [id]);
      if (results.length) {
        return results[0];
      }
      throw new Error("User not found");
    } catch (err) {
      console.error("Error finding user by ID: ", err);
      throw err;
    }
  }

  static async getClassOfHomeroomTeacher(id) {
    const query = "SELECT id FROM classes WHERE homeroom_teacher_id = ?";
    try {
      const [results] = await sql.promise().query(query, [id]);
      if (results.length) {
        return results[0];
      }
      return null;
    } catch (err) {
      console.error("Error getClassOfHomeroomTeacher: ", err);
      throw err;
    }
  }
}

module.exports = { User, UserService };
