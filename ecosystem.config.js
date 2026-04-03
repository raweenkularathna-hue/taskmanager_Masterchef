module.exports = {
  apps: [
    {
      name: 'app',
      script: './backend/server.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
