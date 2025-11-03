module.exports = {
  apps: [
    {
      name: 'solar-frontend',
      script: 'pnpm',
      args: 'start',
      exec_mode: 'fork',
      watch: false,
    },
  ],
}