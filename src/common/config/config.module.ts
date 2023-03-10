
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

console.log(process.env.NODE_ENV);
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
        }),
    ],
})
export class ConfigurationModule { }