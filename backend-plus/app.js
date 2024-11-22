// 使用 Node.js 和 Express 进行后端开发
const express = require("express");
const mysql = require('mysql2/promise'); // 改为 mysql2/promise
const ExcelJS = require('exceljs');
const app = express();
const port = 3000;

// 创建数据库连接池（直接使用 Promise 接口）
const pool = mysql.createPool({
    host: '112.124.65.59',
    user: 'Waller_Shaun',
    password: '040426',
    database: 'softwareHomework',
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000,
    queueLimit: 0
});

// 中间件，用于解析 JSON 请求
app.use(express.json());

// 读取联系人数据函数
const readContacts = async () => {
    const query = 'SELECT * FROM addressBook';
    const [results] = await pool.query(query); // 直接使用 Promise 接口查询
    return results;
};

// 定义一个路由，返回联系人数据
app.get('/addressBook', async (req, res) => {
    try {
        const results = await readContacts();
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "服务器错误", error: err.message });
    }
});

// 导出联系人数据为 Excel 文件
app.get('/export', async (req, res) => {
    try {
        // 查询 MySQL 数据
        const [rows] = await pool.query('SELECT * FROM addressBook'); // 使用 Promise 查询

        // 创建 Excel 文件
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // 添加表头
        worksheet.columns = Object.keys(rows[0]).map(key => ({
            header: key,
            key: key,
            width: 20
        }));

        // 添加数据行
        rows.forEach(row => {
            worksheet.addRow(row);
        });

        // 设置 HTTP 响应头以支持文件下载
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

        // 将 Excel 文件写入响应
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('导出失败', err);
        res.status(500).send('Error generating Excel file');
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
