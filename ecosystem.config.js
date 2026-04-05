module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
