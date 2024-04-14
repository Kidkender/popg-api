import { Injectable } from '@nestjs/common';
import { MilestonesDto, ReleaseAddressDto } from './dto';
import { convertToDecimal } from 'utils';

type milestone = {
  dateRelease: string;
  percentage: string;
  released: boolean;
};

type infoRelease = {
  phase: number;
  percentage: number;
};

@Injectable()
export class ContractMapper {
  mapToMilestoneDto = (data: milestone): MilestonesDto => {
    return {
      timestampt: convertToDecimal(data.dateRelease).toString(),
      percentageRelease: convertToDecimal(data.percentage).toString(),
      released: data.released,
    };
  };

  mapToInforBenificiary = (data: infoRelease[]): ReleaseAddressDto[] => {
    return data.map((item) => {
      return {
        phase: item.phase,
        percentage: item.percentage,
      };
    });
  };
}
