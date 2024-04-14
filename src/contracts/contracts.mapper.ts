import { Injectable } from '@nestjs/common';
import { MilestonesDto } from './dto';
import { convertToDecimal } from 'utils';

type milestone = {
  dateRelease: string;
  percentage: string;
  released: boolean;
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
}
