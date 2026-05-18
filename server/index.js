const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`\n👉 Open: http://localhost:${PORT}`);
  console.log(`👉 Logs: http://localhost:${PORT}/logs\n`);
});