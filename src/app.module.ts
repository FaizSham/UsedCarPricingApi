import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ✅ simplest: load .env locally, but Railway will use Variables
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const nodeEnv = config.get<string>('NODE_ENV');

    // ✅ Local dev: SQLite
    if (nodeEnv === 'development') {
      return {
        type: 'sqlite',
        database: config.get<string>('DB_NAME') || 'db.sqlite',
        autoLoadEntities: true,
        synchronize: true,
      } as any;
    }

    // ✅ Railway/prod: Postgres
    return {
      type: 'postgres',
      url: config.get<string>('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    } as any;
  },
}),


    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
