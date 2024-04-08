import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ChangeAddressDto } from './dto/change-address.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractService: ContractsService) {}

  @Get('token/balance')
  getBalance(@Query('address') address: string) {
    return this.contractService.getBalance(address);
  }

  @Get('totalSupply')
  getTotalSupply() {
    return this.contractService.getTotalSupply();
  }

  @Get('phase:/id')
  async getInforReleasePhase(@Param('id', ParseIntPipe) id: number) {
    return await this.contractService.getInforReleasePhase(id);
  }

  @Get('phase/:address')
  async getInforReleaseAddress(@Param('address') address: string) {
    return await this.contractService.getInforReleaseAddress(address);
  }

  @Get('vesting/balance')
  async getCurrentBalanace(@Query('address') address: string) {
    return await this.contractService.getCurrentBalanceVestingContract();
  }

  @Get('rangeTime')
  getStartEndTime() {
    return this.contractService.getStartAndEndTime();
  }

  @Get('vesting/amount-released')
  getAmountReleased() {
    return this.contractService.getAmountReleased();
  }

  @Get('vesting/releaseable')
  getAmountReleasable() {
    return this.contractService.getAmountReleasable();
  }

  @Get('vesting/phase')
  getCurrentPhase() {
    return this.contractService.getPhaseAtTime();
  }

  @Post('vesting/benificiary')
  changeAddressBenificiary(request: ChangeAddressDto) {
    return this.contractService.changeAddressBenificiary(request);
  }

  @Get('vesting/release')
  release() {
    return this.contractService.release();
  }
}
