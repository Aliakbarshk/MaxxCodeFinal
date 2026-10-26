const { app, ensureDBConnected } = require('./app.cjs');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await ensureDBConnected();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 MaXxCode Auth Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api/auth`);
    console.log(`===============================================\n`);
  });
};

startServer();
