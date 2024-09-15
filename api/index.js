import app from './server';
import { createServer } from 'http';
import { parse } from 'url';

export default async function handler(req, res) {
  const server = createServer(app);
  const parsedUrl = parse(req.url, true);
  server.emit('request', req, res);

}
