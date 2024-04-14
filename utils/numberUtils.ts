import { BigNumber, ethers } from 'ethers';

export const formatEthers = (value: number): string => {
  return ethers.utils.formatEther(value);
};

export const convertToDecimal = (_hexValue: BigNumber | string): bigint => {
  return BigNumber.from(_hexValue).toBigInt();
};
