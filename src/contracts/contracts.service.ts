import { Injectable, Logger } from '@nestjs/common';
import {
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectEthersProvider,
  InjectSignerProvider,
} from 'nestjs-ethers';
import { BaseProvider } from '@ethersproject/providers';
import { ConfigService } from '@nestjs/config';
import { Contract, VoidSigner } from 'ethers';
import { getAbi } from 'utils/ethersUtils';
import { TOKEN_ABI_JSON, TOKEN_ADDRESS } from 'src/common/constants';
import { formatEther } from 'ethers/lib/utils';

@Injectable()
export class ContractsService {
  constructor(
    @InjectContractProvider() private readonly ethersContract: EthersContract,
    @InjectEthersProvider() private readonly ethersProvider: BaseProvider,
    @InjectSignerProvider() private readonly signerProvider: EthersSigner,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(ContractsService.name);
  private readonly PRIVATE_KEY = this.configService.get('PRIVATE_KEY');
  private readonly OWNER_ADDRESS = this.configService.get('OWNER_ADDRESS');

  getVoidSigner(signerAddress: string) {
    return this.signerProvider.createVoidSigner(signerAddress);
  }

  async getContract(
    abiJson: string,
    contractAddress: string,
    signer: VoidSigner,
  ): Promise<Contract> {
    const abi = getAbi(abiJson);
    return this.ethersContract.create(contractAddress, abi, signer);
  }

  private async tokenContract(): Promise<Contract> {
    return await this.getContract(
      TOKEN_ABI_JSON,
      TOKEN_ADDRESS,
      this.getVoidSigner(this.OWNER_ADDRESS),
    );
  }

  public async getBalance(address: string): Promise<string | number> {
    const tokenContract = await this.tokenContract();
    const balance = await tokenContract.callStatic.balanceOf(address);
    return formatEther(balance);
  }
}
