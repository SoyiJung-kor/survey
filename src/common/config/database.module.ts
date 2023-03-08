/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: +configService.get<number>('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    database: configService.get('DB_DATABASE'),
                    password: configService.get('DB_PASSWORD'),
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: true,
                }
            }
        })
    ]
})
export class DatabaseModule { }