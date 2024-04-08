export enum Benificiary {
  BUSINESS = 'buisinessMarketing',
  PRESALE = 'presale',
  RESERVE = 'reserve',
  ADVISOR = 'advisor',
}

export function getIndexFromValue(value: string): number | undefined {
  const keys = Object.keys(Benificiary).filter(
    (k) => typeof Benificiary[k as any] === 'string',
  );
  for (let i = 0; i < keys.length; i++) {
    if (Benificiary[keys[i] as any] === value) {
      return i;
    }
  }
  return undefined;
}
