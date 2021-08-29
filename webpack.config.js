// package.json中通过 --PACK_MODE 指定当前执行的配置文件
const env = process.env.PACK_MODE.trim();
module.exports = require(`./build/webpack.${env}.js`);
