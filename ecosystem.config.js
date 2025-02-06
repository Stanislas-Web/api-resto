module.exports = {
  apps : [{
    name: "app",
    script: "./index.js",
    instances: "max",
    max_memory_restart: "250M",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
