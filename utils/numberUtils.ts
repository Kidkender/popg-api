import { ethers } from 'ethers';

export const formatEthers = (value: number): string => {
  return ethers.utils.formatEther(value);
};
