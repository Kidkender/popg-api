import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DevConfigService } from './common/provider/DevConfig.service';
import { ContractsModule } from './contracts/contracts.module';
import { EthersModule, SEPOLIA_NETWORK } from 'nestjs-ethers';
import { HttpInterceptor } from './common/interceptor/http/http.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { ContractsController } from './contracts/contracts.controller';

@Module({
  imports: [
    EthersModule.forRootAsync({
      inject: [DevConfigService],
      useFactory: async (config: DevConfigService) => {
        return {
          network: SEPOLIA_NETWORK,
          infura: config.infura,
        };
      },
    }),
    ContractsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('contracts');
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'contracts', method: RequestMethod.POST });
    consumer.apply(LoggerMiddleware).forRoutes(ContractsController);
  }
}
