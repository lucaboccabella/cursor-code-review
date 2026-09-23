import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /api/whoami        - Get anonymous user`);
  console.log(`  POST /api/branch/promote - Promote develop to main`);
  console.log(`  POST /api/branch/rollback - Rollback main branch`);
  console.log(`  GET  /api/branch/state  - Get current branch state`);
  console.log(`  GET  /health            - Health check`);
});
