import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Mortgage Calculator API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // 'api' - путь, по которому будет доступна документация
  SwaggerModule.setup('api/docs', app, document);
}
