import { useCallback, useState } from 'react';
import {
  getResult,
  prepareExecuteContract,
  prepareKlipAuth,
} from '../api/klip';
import { ua } from '../lib/ua';
import { message } from 'antd';
import { getAbiByName } from '../lib/util';
import { NFT_ABI } from '../abi/nft-abi';

function useKlip() {
  const [authRequestUrl, setAuthRequestUrl] = useState<string | null>(null);

  const requestKlipAuth = (requestKey: string) => {
    const requestUrl = `https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;
    setAuthRequestUrl(requestUrl);

    if (ua().device.type === 'mobile') {
      window.open(requestUrl);
    }
  };

  const getKlipAddress = useCallback(async () => {
    const { data } = await prepareKlipAuth();
    requestKlipAuth(data.request_key);
    return getResult(data.request_key);
  }, []);

  const mintWithURI = useCallback(
    async (toAddress: string, tokenId: string, tokenURI: string) => {
      try {
        const { data } = await prepareExecuteContract(
          process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
          JSON.stringify(getAbiByName(NFT_ABI, 'mintWithTokenURI')),
          '0',
          [toAddress, tokenId, tokenURI],
        );
        requestKlipAuth(data.request_key);
        return getResult(data.request_key);
      } catch (error) {
        message.error('오류가 발생했습니다.');
      }
    },
    [],
  );

  return {
    authRequestUrl,
    getKlipAddress,
    mintWithURI,
  };
}

export default useKlip;
