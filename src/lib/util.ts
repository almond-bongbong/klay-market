import { AbiItem } from 'caver-js';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(undefined), ms));

export const getAbiByName = <T extends AbiItem>(abi: T[], name: T['name']) =>
  abi.find((a) => a.name === name);
