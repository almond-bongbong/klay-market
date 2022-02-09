declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_STORAGE_CONTRACT_ADDRESS: string;
      REACT_APP_CHAIN_ID: string;
      REACT_APP_KLAY_ACCESS_KEY: string;
      REACT_APP_KLAY_SECRET_KEY: string;
      REACT_APP_KIP17_CONTRACT_ADDRESS: string;
      REACT_APP_NFT_MARKET_ADDRESS: string;
    }
  }
}

export {};
