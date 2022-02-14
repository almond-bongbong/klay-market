import React, { useEffect, useState } from 'react';
import { Card, Col, message, Modal, PageHeader, Row, Statistic } from 'antd';
import { getNftListOf, NftItem } from '../api/caver';
import useKlip from '../hook/useKlip';
import QRCode from 'qrcode.react';

function Market() {
  const [nftList, setNftList] = useState<NftItem[]>([]);
  const { authRequestUrl, buyCard } = useKlip();
  const [showAuthRequestModal, setShowAuthRequestModal] = useState(false);

  useEffect(() => {
    (async () => {
      const nftListData = await getNftListOf(
        process.env.REACT_APP_MARKET_CONTRACT_ADDRESS,
      );
      setNftList(nftListData);
    })();
  }, []);

  const onClickBuy = async (tokenId: string) => {
    Modal.confirm({
      title: '구매하시겠습니까?',
      onOk: async () => {
        try {
          setShowAuthRequestModal(true);
          await buyCard(tokenId);
          message.success('구매하였습니다.');
        } catch (error) {
          message.error('오류가 발생했습니다.');
        } finally {
          setShowAuthRequestModal(false);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader title="Market NFT List">
        <Row>
          <Statistic title="List" value={nftList.length} />
        </Row>
      </PageHeader>

      <div style={{ marginTop: 50, padding: 30 }}>
        <Row gutter={[16, 16]}>
          {nftList.map((nft) => (
            <Col span={6} key={nft.tokenId}>
              <Card
                hoverable
                cover={<img src={nft.tokenURI} alt="NFT" />}
                onClick={() => onClickBuy(nft.tokenId)}
              >
                <Card.Meta title={`NFT ${nft.tokenId}`} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        visible={showAuthRequestModal}
        title="Authorization"
        bodyStyle={{ textAlign: 'center' }}
        zIndex={10000}
        onCancel={() => setShowAuthRequestModal(false)}
      >
        <QRCode value={authRequestUrl || ''} size={200} />
      </Modal>
    </div>
  );
}

export default Market;
