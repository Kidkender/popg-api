import { BaseProvider } from '@ethersproject/providers';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Contract, ethers, VoidSigner, Wallet } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import {
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectEthersProvider,
  InjectSignerProvider,
} from 'nestjs-ethers';
import {
  ERROR_ADDRESS_NOT_FOUND,
  TOKEN_ABI_JSON,
  TOKEN_ADDRESS,
  VESTING_WALLET_ABI_JSON,
  VESTING_WALLET_ADDRESS,
} from 'src/common/constants';
import { convertToDecimal } from 'utils';
import { getAbi } from 'utils/ethersUtils';
import { ContractMapper } from './contracts.mapper';
import { MilestonesDto, ReleaseAddressDto } from './dto';
import { ChangeAddressDto } from './dto/change-address.dto';
import { TimeReleaseDto } from './dto/timeRelease.dto';
import { getIndexFromValue } from './enum/address';

@Injectable()
export class ContractsService {
  constructor(
    @InjectContractProvider() private readonly ethersContract: EthersContract,
    @InjectEthersProvider() private readonly ethersProvider: BaseProvider,
    @InjectSignerProvider() private readonly signerProvider: EthersSigner,
    private readonly configService: ConfigService,
    private readonly contractMapper: ContractMapper,
  ) {}
  private readonly logger = new Logger(ContractsService.name);
  private readonly PRIVATE_KEY = this.configService.get('PRIVATE_KEY');
  private readonly OWNER_ADDRESS = this.configService.get('OWNER_ADDRESS');

  getVoidSigner(signerAddress: string) {
    return this.signerProvider.createVoidSigner(signerAddress);
  }

  getSigner(): Wallet {
    return new ethers.Wallet(this.PRIVATE_KEY, this.ethersProvider);
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

  private async vestingContract(): Promise<Contract> {
    return await this.getContract(
      VESTING_WALLET_ABI_JSON,
      VESTING_WALLET_ADDRESS,
      this.getVoidSigner(this.OWNER_ADDRESS),
    );
  }

  public async getBalance(address: string): Promise<string | number> {
    const tokenContract = await this.tokenContract();
    const balance = await tokenContract.callStatic.balanceOf(address);
    return formatEther(balance);
  }

  public async getTotalSupply(): Promise<string> {
    const tokenContract = await this.tokenContract();
    return formatEther(await tokenContract.callStatic.totalSupply());
  }

  public async getInforReleasePhase(index: number): Promise<MilestonesDto> {
    const vestingContract = await this.vestingContract();
    const result = await vestingContract.callStatic.milestones(index);

    return this.contractMapper.mapToMilestoneDto(result);
  }

  public async getInforBenificiary(
    address: string,
  ): Promise<ReleaseAddressDto[]> {
    try {
      const vestingWallet = await this.vestingContract();
      const result =
        await vestingWallet.callStatic.getDistributionData(address);
      return this.contractMapper.mapToInforBenificiary(result);
    } catch (error) {
      if (error.message.includes('bad address checksum')) {
        throw new NotFoundException(ERROR_ADDRESS_NOT_FOUND);
      } else {
        throw error;
      }
    }
  }

  public async getRangeRelease(): Promise<TimeReleaseDto> {
    const vestingWallet = await this.vestingContract();
    const startDate = await vestingWallet.callStatic.start();
    const endDate = await vestingWallet.callStatic.end();
    return {
      start: convertToDecimal(startDate).toString(),
      end: convertToDecimal(endDate).toString(),
    };
  }

  public async getBenificiary(index: number): Promise<string> {
    const vestingWallet = await this.vestingContract();
    try {
      return await vestingWallet.callStatic.getBenificiary(index);
    } catch (error) {
      throw new BadRequestException(error.reason);
    }
  }

  public async getCurrentBalanceVestingContract(): Promise<number> {
    const vestingWallet = await this.vestingContract();
    return await vestingWallet.getAvailableAmount(TOKEN_ADDRESS);
  }

  public async getAmountReleased(): Promise<number> {
    const vestingWallet = await this.vestingContract();
    return await vestingWallet.callStatic.released(TOKEN_ADDRESS);
  }

  public async getAmountReleasable(): Promise<number> {
    const vestingWallet = await this.vestingContract();
    return await vestingWallet.callStatic.releaseble(TOKEN_ADDRESS);
  }

  public async getPhaseAtTime(): Promise<number> {
    const time = Math.floor(Date.now() / 1000);
    const vestingWallet = await this.vestingContract();
    return await vestingWallet.callStatic.getPhaseAtTime(time);
  }

  public async changeAddressBenificiary(
    request: ChangeAddressDto,
  ): Promise<boolean> {
    const vestingWallet = await this.vestingContract();
    const indexBenificiary = getIndexFromValue(request.typeBenificiary);
    await vestingWallet
      .connect(this.getSigner())
      .changeAddressBenificiary(indexBenificiary, request.newAddress);
    return true;
  }

  public async release(): Promise<boolean> {
    const vestingWallet = await this.vestingContract();
    await vestingWallet.connect(this.getSigner()).release(TOKEN_ADDRESS);
    return true;
  }
}
