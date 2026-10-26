import pkg from '../server/app.cjs';
const { app, ensureDBConnected } = pkg;

export default async function handler(req, res) {
  try {
    await ensureDBConnected();
  } catch (err) {
    console.error('Serverless DB error:', err.message);
  }
  return app(req, res);
}
