"use strict";
const { Role, RoleService } = require("../../models/role.model");
const { Subject, SubjectService } = require("../../models/subject.model");
const { sendEmail } = require('../../utils/emailUtils');

class RoleController {
  async index(req, res) {
    const roleName = req.query.roleName;
    try {
      const [roles, subjects] = await Promise.all([
        RoleService.getRoles(roleName),
        SubjectService.getSubjects()
      ]);
      res.render("admin/role/index", { roles, subjects });
    } catch (err) {
      console.error(err);
      res.redirect("/500");
    }
  }

  async create(req, res) {
    try {
      const roleData = req.body;
      const newRole = await RoleService.insert(roleData);
      if (newRole && !newRole.error) {
        res.status(201).json(newRole);
      } else if (newRole && newRole.error === "Duplicate entry") {
        res.status(409).send({ message: "Duplicate role name.", details: newRole.details });
      } else {
        res.status(401).send("Invalid request, please check your request again.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to create role.");
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const roleData = req.body;
      const updatedRole = await RoleService.update(id, roleData);
      if (updatedRole) {
        res.status(200).json(updatedRole);
      } else if (updatedRole && updatedRole.error === "Duplicate entry") {
        res.status(409).send({ message: "Duplicate role name.", details: updatedRole.details });
      }
      else res.status(401).send("Invalid request, please check your request again.");
    } catch (err) {
      console.error(err)
      res.status(500).send("Failed to update role.");
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const deletedRole = await RoleService.delete(id);
      if (deletedRole) res.status(204).end();
      else res.status(401).send('Invalid request, please check your request again.');
    } catch (err) {
      console.error(err)
      res.status(500).send("Failed to delete role.");
    }
  }
  
  async getUsers(req, res) {
    try {
      const result = await RoleService.getUsers();
      if (result.data) {
        res.json(result);
      } else {
        res.status(401).send("Invalid request, please check your request again.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }

  async createUser(req, res) {
    try {
      const userInfo = req.body;
      const user = await RoleService.createUser(userInfo);
      if (user.userId){
        await this.sendWelcomeEmail(userInfo.email, userInfo.username, user.password);
        res.status(201).json(user);
      }
      else res.status(401).send("Invalid request, please check your request again.");
    } catch (error) {
      console.error("Error in creating user:", error.message);
      if (error.message.includes('Username already exists') || error.message.includes('Email already exists')) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create user." });
      }
    }
  }

  async sendWelcomeEmail(recipient, username, password) {
    try {
      let subject = `Chào mừng bạn đến với Trường THPT MNO!`;

      let textContent = `
      Xin chào,

      Chào mừng bạn đến với Trường THPT MNO! Chúng tôi rất vui mừng được chào đón bạn.
      Tài khoản của bạn đã được thiết lập và đây là thông tin tài khoản:

      Tên đăng nhập: ${username}
      Mật khẩu: ${password}

      Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.

      Cảm ơn,
      Đội ngũ Trường THPT MNO
      `;

      let htmlContent = `
      <html>
      <head></head>
      <body>
          <p>Xin chào,</p>

          <p>Chào mừng bạn đến với <strong>Trường THPT MNO</strong>! Chúng tôi rất vui mừng được chào đón bạn.</p>
          <p>Tài khoản của bạn đã được thiết lập và đây là thông tin tài khoản:</p>

          <p><strong>Tên đăng nhập:</strong> ${username}</p>
          <p><strong>Mật khẩu:</strong> ${password}</p>

          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>

          <p>Cảm ơn,<br/>
          <strong>Đội ngũ Trường THPT MNO</strong></p>
      </body>
      </html>
      `; 
      const info = await sendEmail(recipient, subject, textContent, htmlContent);
      console.log('Welcome email sent:', info);
    } catch (err) {
      console.error('Error sending Welcome email:', err);
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const userInfo = req.body;
      const user = await RoleService.updateUser(id, userInfo);
      if (user) {
        userInfo.role = user.role;
        res.status(200).json(userInfo);
      }
      else res.status(401).send("Invalid request, please check your request again.");
    } catch (error) {
      console.error("Error in updating user:", error.message);
      if (error.message.includes('Username already exists') || error.message.includes('Email already exists')) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create user." });
      }
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const deletedRole = await RoleService.deleteUser(id);
      if (deletedRole) res.status(204).end();
      else res.status(401).send('Invalid request, please check your request again.');
    } catch (err) {
      console.error(err)
      res.status(500).send("Failed to delete role.");
    }
  }
}

module.exports = new RoleController();
