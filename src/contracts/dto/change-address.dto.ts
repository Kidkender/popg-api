import { Benificiary } from '../enum/address';

export class ChangeAddressDto {
  typeBenificiary: Benificiary;
  newAddress: string;
}
