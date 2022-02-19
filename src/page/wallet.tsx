import React, { useCallback, useEffect, useState } from 'react';
import { useMyContext } from '../context/my-context';
import useKlip from '../hook/useKlip';
import { getBalance, getNftListOf } from '../api/caver';
import { ME_STORAGE_KEY } from '../constant/key';
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  PageHeader,
  Row,
  Statistic,
} from 'antd';
import QRCode from 'qrcode.react';
import { ua } from '../lib/ua';

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

  const logout = useCallback(() => {
    setMe(null);
    localStorage.removeItem(ME_STORAGE_KEY);
  }, [setMe]);

  const initMyNftList = useCallback(async () => {
    if (!me?.address) return;

    const nftListData = await getNftListOf(me.address);
    setNftList(nftListData);
  }, [me?.address]);

  useEffect(() => {
    initMyNftList();
  }, [initMyNftList]);

  const onClickCard = (tokenId: string) => {
    if (!me?.address) {
      message.warning('로그인 해주세요.');
      return;
    }

    Modal.confirm({
      title: `"${tokenId}"를 마켓에 등록하시겠습니까?`,
      onOk: async () => {
        if (ua().device.type !== 'mobile') setShowAuthRequestModal(true);
        const data = await listingCardToMarket(me.address, tokenId);
        if (data?.result?.status === 'success') {
          message.success('마켓에 등록되었습니다.');
          setShowAuthRequestModal(false);
          await initMyNftList();
        }
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="My Wallet"
        subTitle={me?.address}
        extra={
          <Button size="small" type="text" onClick={me ? logout : getUser}>
            {me ? 'logout' : 'login'}
          </Button>
        }
      >
        <Row>
          <Statistic title="Balance" prefix="klay" value={me?.balance} />
        </Row>
      </PageHeader>

      {me ? (
        <div style={{ marginTop: 50, padding: 30 }}>
          <Row gutter={[16, 16]}>
            {nftList.map((nft) => (
              <Col
                span={ua().device.type === 'mobile' ? 12 : 6}
                key={nft.tokenId}
              >
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
        footer={false}
      >
        <QRCode value={authRequestUrl || ''} size={200} />
      </Modal>
    </div>
  );
}

export default Wallet;
