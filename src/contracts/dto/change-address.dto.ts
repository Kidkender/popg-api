import { Benificiary } from '../enum/address';
import { IsNotEmpty } from 'class-validator';

export class ChangeAddressDto {
  typeBenificiary: Benificiary;

  @IsNotEmpty()
  newAddress: string;
}
