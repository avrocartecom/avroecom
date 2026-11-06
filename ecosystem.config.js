// ==============================================================================
// AVRO CUSTOMER STOREFRONT — PM2 CLUSTER ECOSYSTEM CONFIGURATION
// ==============================================================================
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup
// ==============================================================================

module.exports = {
  apps: [
    {
      name: "avro-customer-store",
      cwd: "../",
      script: "npm",
      args: "--workspace=apps/store run start",
      instances: 1, // Change to 'max' for multi-core load balancing
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "./logs/store-err.log",
      out_file: "./logs/store-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      min_uptime: "30s",
      max_restarts: 10,
    },
  ],
};
