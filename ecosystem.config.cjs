// module.exports = {
//     apps: [
//       {
//         name: 'peptalk_admin_dev',
//         script: 'npm',
//         args: 'run dev',
//         exp_backoff_restart_delay: 100,
//         env: {
//           NODE_ENV: "development",
//         },
//       },
//       {
//         name: 'peptalk_admin_prod',
//         script: 'npm',
//         args: 'run start:prod',
//         exp_backoff_restart_delay: 100,
//         env_production: {
//           NODE_ENV: "production",
//         },
//       },
//     ],
//   };

module.exports = {
  apps: [
    {
      name: 'peptalk_admin_prod',
      script: 'npx',
      args: 'serve -s dist -l 5501',
      cwd: '/home/ubuntu/workspace/frontend/admin_dashboard_peptalkindia',
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
