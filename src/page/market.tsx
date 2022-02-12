import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, PageHeader, Row, Statistic } from 'antd';
import QRCode from 'qrcode.react';
import useKlip from '../hook/useKlip';
import { getBalance, getNftListOf } from '../api/caver';
import { useMyContext } from '../context/my-context';

function Market() {
  const { setAddress } = useMyContext();
  const { authRequestUrl, getKlipAddress } = useKlip();
  const [myBalance, setMyBalance] = useState('');
  const [myAddress, setMyAddress] = useState('');
  const [nftList, setNftList] = useState<
    { tokenId: string; tokenURI: string }[]
  >([]);

  const getUser = useCallback(async () => {
    const data = await getKlipAddress();
    const klayBalance = await getBalance(data.result.klaytn_address);
    setMyBalance(klayBalance);
    setMyAddress(data.result.klaytn_address);
    setAddress(data.result.klaytn_address);
  }, [getKlipAddress, setAddress]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!myAddress) return;
    (async () => {
      const nftListData = await getNftListOf(myAddress);
      setNftList(nftListData);
    })();
  }, [myAddress]);

  return (
    <div>
      <PageHeader title="내 지갑" subTitle={myAddress}>
        <Row>
          <Statistic title="Balance" prefix="klay" value={myBalance} />
        </Row>
      </PageHeader>
      <div style={{ textAlign: 'center' }}>
        {authRequestUrl && <QRCode value={authRequestUrl} size={200} />}
      </div>
      <div style={{ marginTop: 50, padding: 30 }}>
        <Row gutter={[16, 16]}>
          {nftList.map((nft) => (
            <Col span={6} key={nft.tokenId}>
              <Card hoverable cover={<img src={nft.tokenURI} alt="NFT" />}>
                <Card.Meta title={`NFT ${nft.tokenId}`} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Market;
