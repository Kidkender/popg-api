import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { SEPOLIA_JSON_RPC } from 'src/common/constants';
import { SEPOLIA_NETWORK } from 'nestjs-ethers';

Injectable();
export class DevConfigService {
  DBHOST = 'localhost';
  getDBHOST() {
    return this.DBHOST;
  }

  constructor(private readonly configServices: ConfigService) {}

  private projectSecret = this.configServices.get('PROJECT_SECRET');
  private projectId = this.configServices.get('PROJECT_ID');

  public readonly infura = {
    projectId: this.projectId,
    projectSecret: this.projectSecret,
  };

  getJsonRpc = () => {
    const networkProvider = new ethers.providers.JsonRpcProvider(
      `${SEPOLIA_JSON_RPC + this.projectSecret}`,
      SEPOLIA_NETWORK,
    );
    return networkProvider;
  };
}
