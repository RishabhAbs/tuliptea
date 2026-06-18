module.exports = {
  apps: [
    {
      name: 'tuliptea-api',
      script: 'server/index.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
