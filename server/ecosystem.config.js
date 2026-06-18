module.exports = {
  apps: [
    {
      name: 'tuliptea-backend',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
