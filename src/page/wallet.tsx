import React, { useCallback, useEffect, useState } from 'react';
import { useMyContext } from '../context/my-context';
import useKlip from '../hook/useKlip';
import { getBalance, getNftListOf } from '../api/caver';
import { ME_STORAGE_KEY } from '../constant/key';
import { Card, Col, message, Modal, PageHeader, Row, Statistic } from 'antd';
import QRCode from 'qrcode.react';

function Wallet() {
  const { me, setMe } = useMyContext();
  const { authRequestUrl, getKlipAddress, listingCardToMarket } = useKlip();
  const [nftList, setNftList] = useState<
    { tokenId: string; tokenURI: string }[]
  >([]);
  const [showAuthRequestModal, setShowAuthRequestModal] = useState(false);

  const getUser = useCallback(async () => {
    const data = await getKlipAddress();
    const klayBalance = await getBalance(data.result.klaytn_address);
    const loggedInMe = {
      address: data.result.klaytn_address,
      balance: klayBalance,
    };
    setMe(loggedInMe);
    localStorage.setItem(ME_STORAGE_KEY, JSON.stringify(loggedInMe));
  }, [getKlipAddress, setMe]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!me?.address) return;
    (async () => {
      const nftListData = await getNftListOf(me.address);
      setNftList(nftListData);
    })();
  }, [me?.address]);

  const onClickCard = (tokenId: string) => {
    if (!me?.address) {
      message.warning('로그인 해주세요.');
      return;
    }

    Modal.confirm({
      title: `${tokenId} 카드를 마켓에 등록하시겠습니까?`,
      onOk: async () => {
        setShowAuthRequestModal(true);
        const result = await listingCardToMarket(me.address, tokenId);
        if (result?.status === 'success') {
          message.success('마켓에 등록되었습니다.');
          setShowAuthRequestModal(false);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader title="My Wallet" subTitle={me?.address}>
        <Row>
          <Statistic title="Balance" prefix="klay" value={me?.balance} />
        </Row>
      </PageHeader>

      {me ? (
        <div style={{ marginTop: 50, padding: 30 }}>
          <Row gutter={[16, 16]}>
            {nftList.map((nft) => (
              <Col span={6} key={nft.tokenId}>
                <Card
                  hoverable
                  cover={<img src={nft.tokenURI} alt="NFT" />}
                  onClick={() => onClickCard(nft.tokenId)}
                >
                  <Card.Meta title={`NFT ${nft.tokenId}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {authRequestUrl && <QRCode value={authRequestUrl} size={200} />}
        </div>
      )}

      <Modal
        visible={showAuthRequestModal}
        title="Authorization"
        bodyStyle={{ textAlign: 'center' }}
        onCancel={() => setShowAuthRequestModal(false)}
      >
        <QRCode value={authRequestUrl || ''} size={200} />
      </Modal>
    </div>
  );
}

export default Wallet;
