var express = require('express');
var router = express.Router();
//发邮件的模块
const nodemailer = require("nodemailer");
//连接数据库的脚本
var connection = require('../public/javascripts/sql.js')
//密码加密模块
const crypto = require('crypto')
//token生成模块
const jsonwebtoken = require('jsonwebtoken')
//密码解密模块
const nodeRSA = require('node-rsa')
//读取文件
const fs = require('fs')
//设置时区
const moment = require('moment-timezone');




moment.utc()
const publicKey = fs.readFileSync('./rsa_public_key.pem').toString('utf-8')
const privateKey = fs.readFileSync('./rsa_private_key.pem').toString('utf-8')
var code;



//邮件参数
var transPort = nodemailer.createTransport({
	service: '163',
	host: 'smtp.163.com',
	port: 456,
	secure: true,
	auth: {
		user: 'fzudzry@163.com',
		pass: '******'
	}
});


//获取公钥
router.get('/key', function(req, res, next) {
	res.send({
		publicKey:publicKey
	})
});

router.post('/user', function(req, res, next) {
    // 接收到的密文自动把+号替换成空了，这里替换了下。
    let userInfo  = req.body.key.replace(/\s+/g, '+')
    console.log(userInfo)
    let buffer2 = new Buffer(userInfo, 'base64')
    let decrypted = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        buffer2
    )

    userInfo =decrypted.toString('utf-8') 
    console.log(userInfo);  //打印解密后的密文。
    //PS 如果得到空值，是因为格式不正确，貌似只可以用字符串加密解密。
	res.send({
		publicKey:userInfo
	})
});


//RSA解密
const decrypt = (password) => {
	let encryptedPassword = password.replace(/\s+/g, '+')
	let buffer2 = new Buffer(encryptedPassword, 'base64')
	    let decrypted = crypto.privateDecrypt({
	            key: privateKey,
	            padding: crypto.constants.RSA_PKCS1_PADDING
	        },
	        buffer2
	    )
	
	    decryptedPassword = decrypted.toString('utf-8') 
	    console.log(decryptedPassword);  //打印解密后的密文。
	    //PS 如果得到空值，是因为格式不正确，貌似只可以用字符串加密解密。
		return decryptedPassword;

}

//生成SHA256加密后密码
const cryptoPwd = (password) => {
	const hash = crypto.createHash('sha256');
	return hash.update(password).digest('hex');
}

//获取用户唯一指定id
const getAccountId = async (account) => {
	const sql = 'select * from user where account = ?'
	let res = await connection.sqlConnection(sql, [account])
	if(res[0]){
		return res[0].id
	}else{
		return false
	}
}


//获取用户的通讯录
router.post('/getAddressBook', async function(req, res, next) {
	let account = req.body.account
	let id = await getAccountId(account)
	let sql = 'select * from addressBook where userid = ? ORDER BY favorite DESC;'
	let addressBook = await connection.sqlConnection(sql, [id])
	res.send(addressBook)
});

//删除用户的通讯录
router.post('/deleteAddressBook', async function(req, res, next) {
	let account = req.body.account
	let name = req.body.name
	let id = await getAccountId(account)
	let sql = 'delete from addressBook where userid = ? and name = ?'
	let addressBook = await connection.sqlConnection(sql, [id,name])
	res.send(addressBook)
});

//增加用户通讯录信息
router.post('/addAddressBook', async function(req, res, next) {
	let account = req.body.account
	let phone = req.body.phone
	let address = req.body.address
	let name = req.body.name
	let addition = req.body.addition
	let id = await getAccountId(account)
	let avator = 'https://api.multiavatar.com/' + phone.toString() + '.svg'
	let sql = 'INSERT IGNORE INTO addressBook (userid,name,phoneNumber,address,avator,addition) values (?,?,?,?,?,?)'
	let report = await connection.sqlConnection(sql, [id,name,phone,address,avator,addition])
	res.send(report)
});

//修改用户通讯录信息
router.post('/changeAddressBook', async function(req, res, next) {
	let account = req.body.account
	let phone = req.body.phone
	let address = req.body.address
	let name = req.body.name
	let id = await getAccountId(account)
	let avator = 'https://api.multiavatar.com/' + phone.toString() + '.svg'
	let sql = 'update addressBook set phoneNumber = ?,address = ? where userid = ? and name = ?'
	let report = await connection.sqlConnection(sql, [phone,address,id,name])
	res.send(report)
});

//添加收藏
router.post('/favorite', async function(req, res, next) {
	let account = req.body.account
	let name = req.body.name
	let isFavorite = !req.body.favorite
	// isFavorite = false
	console.log(isFavorite)
	let id = await getAccountId(account)
	let sql = 'update addressBook set favorite = ? where userid = ? and name = ?'
	let report = await connection.sqlConnection(sql, [isFavorite,id,name])
	res.send(report)
});

//检测用户是否存在
const checkUser = async (account) => {
	const sql = 'select * from user where account = ?'
	const res = await connection.sqlConnection(sql, [account])
	if (res[0]) {
		return res[0];
	} else {
		return false;
	}
}

//注册用户
const registerUser = async (account, password) => {
	const sql = 'INSERT IGNORE INTO user (account,password) values (?,?) '
	const cryptoPassword = cryptoPwd(password);
	const res = await connection.sqlConnection(sql, [account, cryptoPassword])
	return
}

//检测验证码
const checkVercode = async (account,vercode) => {
	const sql = 'select * from vercode where account = ? and vercode = ? ORDER BY ID DESC LIMIT 1'
	const res = await connection.sqlConnection(sql, [account,vercode])
	if (res[0]) {
		return res[0];
	} else {
		return false;
	}
}

//保存验证码
const saveVercode = async (account,vercode) => {
	const now = moment().format('YYYY-MM-DD HH:mm:ss');
	const allowtime = moment().add(2,'minutes').format('YYYY-MM-DD HH:mm:ss')
	const sql = 'INSERT INTO vercode (account,vercode,time,allowtime) values (?,?,?,?) '
	const res = await connection.sqlConnection(sql, [account,vercode,now,allowtime])
	return
}

//生成用户登录token (这部分废弃)
// const createToken = () =>{
// 	return jsonwebtoken.sign(user,'userToken',{exprisIn:"30day"})
// }

router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

//登录且注册接口
router.post('/login', async function(req, res, next) {
	const {
		account,
		password,
		vercode
	} = req.body;
	const minutes = 30 * 1000;
	// const checknow = new Date();
	const checknow = moment().format('YYYY-MM-DD HH:mm:ss');
	// const allowTime = moment().add(2,'minutes').format('YYYY-MM-DD HH:mm:ss');
	// const allowTime = new Date(checknow.getTime() + minutes)
	const accountDetail = await checkUser(account);
	const decryptPassword = decrypt(password);
	const cryptoPassword = cryptoPwd(decryptPassword);
	const vercodeSql = await checkVercode(account,vercode);
	// const token = createToken({
	// 	account,
	// });

	console.log("cryptoPassword:",cryptoPassword);
	console.log('decryptPassword:',decryptPassword);
	console.log("accountDetail",accountDetail);
	console.log("vercodeSql",vercodeSql);
	console.log(checknow)
	// console.log(allowTime)

	//如果账户存在
	if(vercodeSql.vercode == vercode.toUpperCase() && checknow < vercodeSql.allowtime){
		if (accountDetail != false) {
			//如果账户存在且密码一致登录成功,不成功则密码输入错误
			if (cryptoPassword === accountDetail.password) {
				res.send({
					code: "200",
					msg: "登录成功！",
					data: {}
				})
			} else {
				res.send({
					code: "202",
					msg: "请检查用户和密码！",
				})
			}
		} else {
			//账户不存在执行注册操作
			res.send({
				code: "200",
				msg: "注册成功！",
			})
			registerUser(account, decryptPassword);
		}
	}else{
		res.send({
			code: "203",
			msg: "验证码错误！",
		})
	}

});

router.post("/verify",function(req, res, next) {
	let email = req.body.account
	code = Math.random().toString(16).slice(2, 8).toUpperCase();
	saveVercode(email,code)
	const sendConfig = {
		// 目标邮箱
	    to: `${email}`,
		// 发件人邮箱
	    from: 'fzudzry@163.com',
		// 邮件标题
	    subject: '验证码',
		// 邮件内容
	    text: `欢迎使用摸鱼通讯录，您的验证码是：${code}, 有效期2分钟，如非您本人操作请忽略。`
	}
	transPort.sendMail(sendConfig, (error, result) => {
	    if (error) {
	      res.end('fail')
	    } else {
	      res.end('success')
	    }
	})

});


module.exports = router;