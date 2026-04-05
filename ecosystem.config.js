module.exports = {
  apps: [
    {
      name: 'backend',
      script: './backend/server.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
