import { getBootstrapApp } from './bootstrap';

async function bootstrap() {
  const app = await getBootstrapApp();

  await app.listen(3000);

  return app;
}
bootstrap();
