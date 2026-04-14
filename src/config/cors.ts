import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication) {
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE',
    credentials: true
  });
}
