import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ethers } from 'ethers';
import { SEPOLIA_NETWORK } from 'nestjs-ethers';
import { SEPOLIA_JSON_RPC } from '../constants';

@Injectable()
export class DevConfigService {
  constructor(private readonly configService: ConfigService) {}
  private projectSecet = this.configService.get('PROJECT_SECRET');
  private projectId = this.configService.get('PROJECT_ID');

  public readonly infura = {
    projectId: this.projectId,
    projectSecret: this.projectSecet,
  };

  getJsonRpc = () => {
    const networkProvider = new ethers.providers.JsonRpcProvider(
      `${SEPOLIA_JSON_RPC + this.projectSecet}`,
      SEPOLIA_NETWORK,
    );
    return networkProvider;
  };
}
