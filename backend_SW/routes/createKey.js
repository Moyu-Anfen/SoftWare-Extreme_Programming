const crypto = require('crypto')
function generateKeyPair() {
  // 使用RSA和指定的位数
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 1024, // 标准的2048位长度
  });
  return {
    publicKey: keyPair.publicKey.export({ type: 'pkcs1', format: 'pem' }),
    privateKey: keyPair.privateKey.export({ type: 'pkcs1', format: 'pem' }),
  };
}

// 使用函数并保存密钥
const { publicKey, privateKey } = generateKeyPair();
console.log('公钥:', publicKey);
console.log('私钥:', privateKey);