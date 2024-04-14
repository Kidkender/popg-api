import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractMapper } from './contracts.mapper';
import { ContractsService } from './contracts.service';

@Module({
  providers: [ContractsService, ContractMapper],
  controllers: [ContractsController],
})
export class ContractsModule {}
