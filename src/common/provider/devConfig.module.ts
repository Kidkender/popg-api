import { Module } from '@nestjs/common';
import { EthersModule, SEPOLIA_NETWORK } from 'nestjs-ethers';
import { DevConfigService } from './DevConfig.service';

@Module({
  imports: [
    EthersModule.forRootAsync({
      imports: [DevConfigModule],
      inject: [DevConfigService],
      useFactory: async (config: DevConfigService) => {
        return {
          network: SEPOLIA_NETWORK,
          infura: config.infura,
          useDefaultProvider: true,
        };
      },
    }),
  ],
  providers: [DevConfigService],
  exports: [DevConfigService],
})
export class DevConfigModule {}
