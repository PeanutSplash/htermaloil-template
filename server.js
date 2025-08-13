const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());

// 静态文件服务
app.use(express.static('.'));

// 处理SPA路由 - 所有未匹配的路由都返回index.html
app.get('*', (req, res) => {
  // 如果请求的是文件（有扩展名），则返回404
  if (path.extname(req.path)) {
    res.status(404).send('File not found');
    return;
  }
  
  // 否则返回index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 开发服务器已启动！`);
  console.log(`📍 本地地址: http://localhost:${PORT}`);
  console.log(`📁 服务目录: ${__dirname}`);
  console.log(`⏹️  按 Ctrl+C 停止服务器`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 服务器已停止');
  process.exit(0);
});
