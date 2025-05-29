module.exports = {
  apps: [
    {
      name: "mesto",
      script: "./src/app.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
  deploy: {
    production: {
      user: "praktikum",
      host: "158.160.100.179",
      ref: "origin/main",
      repo: "git@github.com:NetLive5/nodejs-mesto-project.git",
      path: "/home/praktikum/mesto-backend",
      "post-deploy":
        "npm ci && pm2 reload ecosystem.config.js --env production",
    },
  },
};
