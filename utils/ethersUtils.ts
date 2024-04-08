import * as fs from 'fs';

export const getAbi = (pathFile: string) => {
  const parsed = JSON.parse(
    fs.readFileSync(`utils/abi/${pathFile}.json`, 'utf8'),
  );
  return parsed.abi;
};
