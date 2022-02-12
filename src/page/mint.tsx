import React, { useState } from 'react';
import { Button, Form, Image, Input, message } from 'antd';
import useKlip from '../hook/useKlip';
import { useMyContext } from '../context/my-context';
import QRCode from 'qrcode.react';

interface FormData {
  uri: string;
}

// https://cdn.pixabay.com/photo/2022/01/16/15/03/finch-6942278_960_720.jpg

function Mint() {
  const [values, setValues] = useState<FormData>();
  const { authRequestUrl, mintWithURI } = useKlip();
  const { address } = useMyContext();

  const handleChange = (_: unknown, allValues: FormData) => {
    setValues(allValues);
  };

  const handleMint = async () => {
    console.log('mint');
    if (!address) {
      message.warning('지갑을 인증해 주세요.');
      return;
    }
    if (!values?.uri) {
      message.warning('URI를 입력해주세요.');
      return;
    }

    const randomTokenId = (Math.random() * 100000000).toFixed();
    const result = await mintWithURI(address, randomTokenId, values.uri);
    console.log(result);
  };

  return (
    <Form<FormData>
      initialValues={values}
      onValuesChange={handleChange}
      style={{ padding: 20 }}
      layout="vertical"
    >
      {authRequestUrl && (
        <Form.Item>
          <QRCode value={authRequestUrl} size={200} />
        </Form.Item>
      )}
      {values?.uri && (
        <Form.Item>
          <Image src={values.uri} />
        </Form.Item>
      )}
      <Form.Item label="URI" name="uri">
        <Input placeholder="이미지 주소를 입력해주세요" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleMint}>
          Mint!
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Mint;
