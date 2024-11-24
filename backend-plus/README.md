# **Backend-Plus**

## **项目简介**

`Backend-Plus` 是一个基于 Node.js 和 Express 构建的后端项目，支持以下功能：

- 联系人信息的管理。
- Excel 文件的导入和导出功能。
- 提供 RESTful API 接口，与前端或第三方工具（如 Postman）交互。

此项目的数据库操作通过 MySQL 实现，上传的文件存储于 `uploads` 文件夹中。

------

## **功能实现**

### 1. **Excel 导出**

- 从数据库中导出指定用户的联系人信息。

- 导出的文件格式为 

  ```
  .xlsx
  ```

  ，包含以下字段：

  - 姓名
  - 电话号码
  - 地址
  - 头像 URL
  - 收藏状态

### 2. **Excel 导入**

- 从上传的 Excel 文件中读取联系人信息，批量导入到数据库。
- 自动为每条联系人记录生成头像 URL。
- 支持校验和错误处理，确保数据格式正确。

------

## **项目目录**

```plaintext
BACKEND-PLUS
├── models                 // 数据模型
│   └── db.js              // 数据库连接文件（已被 .gitignore 忽略）
├── uploads                // 上传的 Excel 文件存储目录
├── app.js                 // 主入口文件
├── package.json           // 项目依赖
├── package-lock.json      // 依赖锁文件
├── .gitignore             // 忽略规则
```

------

## **安装与运行**

### **1. 克隆仓库**

```bash
git clone https://github.com/your-repository-link.git
cd BACKEND-PLUS
```

### **2. 安装依赖**

```bash
npm install
```

### **3. 配置数据库**

- 确保 MySQL 数据库运行，并根据需求创建以下表结构：

  ```sql
  CREATE TABLE user (
      id INT PRIMARY KEY AUTO_INCREMENT,
      account VARCHAR(255) NOT NULL,
      password varchar(255) NOT NULL
  );
  
  CREATE TABLE addressBook (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userid INT NOT NULL,
      name VARCHAR(255),
      phoneNumber VARCHAR(255),
      address VARCHAR(255),
      avator VARCHAR(255),
      favorite BOOLEAN DEFAULT 0,
      addition VARCHAR(255)
  );
  ```

- 配置  `models/db.js`文件中的数据库连接信息：

  ```javascript
  const mysql = require('mysql2');
  const pool = mysql.createPool({
      host: 'your-database-host',
      user: 'your-database-user',
      password: 'your-database-password',
      database: 'your-database-name'
  }).promise();
  module.exports = pool;
  ```

### **4. 启动项目**

```bash
node app.js
```

### **5. 访问服务**

- 在浏览器或 Postman 中访问：

  ```arduino
  http://localhost:3001
  ```

------

## **API 接口**

### **1. 导出联系人信息**

- **接口**：`GET /export`

- **功能**：根据用户账号导出其联系人信息。

- **请求参数**：
  - **account**：用户的账号（作为查询条件）。
  
- **响应**：返回 `.xlsx` 文件。

**示例请求**：

```bash
GET http://localhost:3001/export?account=test@example.com
```

------

### **2. 导入联系人信息**

- **接口**：`POST /import`

- **功能**：从上传的 Excel 文件中读取联系人信息并导入到数据库。

- **请求格式**：

  - **Content-Type**: `multipart/form-data`
  - 上传文件字段名为 `file`
  - 包含 `account` 参数，用于绑定联系人所属用户。

- **响应**：
  - 成功返回导入的联系人数量。
  - 失败返回错误信息。

**示例请求**：

```bash
POST http://localhost:3001/import
```

- **请求体**：

  - 一个 `.xlsx` 文件（字段：`name`、`phone`、`address`）。
  - `account` 参数。

**示例响应**：

```json
{
    "message": "联系人已成功导入",
    "importedCount": 10
}
```

------

## **环境需求**

- Node.js >= 14.x
- MySQL >= 5.7

------

## **注意事项**

1. **数据库配置文件未上传**：

   - `models/db.js` 文件被 `.gitignore` 忽略，请确保手动配置数据库连接信息。

2. **文件存储目录**：

   - 上传的 Excel 文件会临时存储在 `uploads` 文件夹中。

------

## **未来计划**

1. 增加更多联系人管理功能（如联系人分组、批量删除等）。
2. 实现更全面的数据校验和错误处理机制。
3. 添加单元测试，确保项目的稳定性。