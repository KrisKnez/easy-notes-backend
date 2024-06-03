// /vercel-func.js
import { HttpAdapterHost } from '@nestjs/core';
import { getBootstrapApp } from './dist/src/bootstrap';

// Keep the app instance in memory for subsequent requests
let app;
export default async function handler(req, res) {
  // Bootstrap our NestJS app on cold start
  if (!app) app = await getBootstrapApp();

  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;
  const instance = httpAdapter.getInstance();

  instance(req, res);
}
