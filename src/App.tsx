import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import useKlip from './hook/useKlip';
import { getBalance } from './api/caver';
import QRCode from 'qrcode.react';
import { Layout, PageHeader, Row, Statistic } from 'antd';

const { Header } = Layout;

function App() {
  const { authRequestUrl, getKlipAddress } = useKlip();
  const [myBalance, setMyBalance] = useState('');
  const [myAddress, setMyAddress] = useState('');
  const [nftList] = useState<string[]>([]);

  const getUser = useCallback(async () => {
    const data = await getKlipAddress();
    const klayBalance = await getBalance(data.result.klaytn_address);
    setMyBalance(klayBalance);
    setMyAddress(data.result.klaytn_address);
  }, [getKlipAddress]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Layout>
      <PageHeader title="내 지갑" subTitle={myAddress}>
        <Row>
          <Statistic title="Balance" prefix="klay" value={myBalance} />
        </Row>
      </PageHeader>
      <div style={{ textAlign: 'center' }}>
        {authRequestUrl && <QRCode value={authRequestUrl} size={200} />}
      </div>
      <div>{myBalance}</div>
      <div>{myAddress}</div>
      <div>{nftList}</div>
    </Layout>
  );
}

export default App;
