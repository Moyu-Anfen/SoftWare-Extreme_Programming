// 使用 Node.js 和 Express 进行后端开发
const express = require("express");
const mysql = require('mysql2/promise'); // 改为 mysql2/promise
const ExcelJS = require('exceljs');
const app = express();
const port = 3001;
const pool = require('./models/db.js'); // 数据库连接
const multer = require('multer'); // 用于处理文件上传
const router = express.Router();
// 中间件，用于解析 JSON 请求
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '');
    next();
  });
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
// Access-Control-Allow-Headers：可根据浏览器的F12查看，把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods","*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// 配置 multer 中间件，用于存储上传的文件
const upload = multer({ dest: 'uploads/' }); // 文件存储到临时目录 uploads/

// 读取联系人数据函数
const readContacts = async () => {
    const query = 'SELECT * FROM addressBook';
    const [results] = await pool.query(query); // 直接使用 Promise 接口查询
    return results;
};

const getAccountId = async (account) => {
	const sql = 'select * from user where account = ?';
	res = await pool.query(sql, [account])
	if(res[0][0]){
		return res[0][0].id
	}else{
        console.error("未找到用户id")
		return false
	}
}


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
app.get('/export:account', async (req, res) => {

    const account = req.query.account;
    if (!account) {
        return res.status(400).send('请求缺少 account 参数');
    }

    console.log("body:"+ JSON.stringify(req.body, null, 2))
    console.log(account)
    const id = await getAccountId(account)
    
    try {
        // 查询 MySQL 数据
        const [rows] = await pool.query('SELECT * FROM addressBook where userid = ?',[id]); // 使用 Promise 查询

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

app.post('/import', upload.single('file'), async (req, res) => {
    
    const filePath = req.file.path; // 获取上传文件的路径
    const account = req.body.account;
    console.log("account:"+ account)
    const id = await getAccountId(account)
    try {
        // 读取 Excel 文件
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1); // 获取第一个工作表

        const contacts = []; // 存储解析出的联系人信息
        // 遍历工作表中的每一行
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // 跳过表头
            const contact = {
                userid: id,
                name: row.getCell(1).value, 
                phone: row.getCell(2).value, 
                address: row.getCell(3).value,
                avator : 'https://api.multiavatar.com/' + row.getCell(2).value.toString() + '.svg',
                favorite : 0
            };
            contacts.push(contact); // 将联系人信息添加到数组
        });

        // 将数据插入到数据库
        for (const contact of contacts) {
            await pool.query('INSERT INTO addressBook (userid, name, phoneNumber, address, avator, favorite) VALUES (?, ?, ?, ?, ?, ?)', [
                contact.userid,
                contact.name,
                contact.phone,
                contact.address,
                contact.avator,
                contact.favorite
            ]);
        }

        // 返回成功消息
        res.status(200).json({ message: '联系人已成功导入', importedCount: contacts.length });

    } catch (err) {
        console.error('处理文件时发生错误:', err);
        res.status(500).json({ message: '服务器错误，无法处理文件' });
    }
});



// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
