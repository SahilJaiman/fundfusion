'use client';
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Select, InputNumber, Descriptions, Space, Image, Upload, message } from 'antd';
import { ConfigProvider, theme } from 'antd';
import { NotificationOutlined, ArrowLeftOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAccount, connectWallet } from '@/utils/wallet';
import { useForm } from 'antd/lib/form/Form';
import { createPostOperation } from '@/utils/operation';

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};







export default function NewCampaign() {

    const [form] = useForm();
    const [price, setPrice] = useState(null);
    const [amt, setAmt] = useState(0);
    const [imgUrl, setImgUrl] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const onConnectWallet = async () => {
        await connectWallet();
        const activeAccount = await getAccount();
        setAccount(activeAccount);


    };
    const onFinish = async (values) => {
        setLoading(true);
        messageApi.open({
            key: '1',
            type: 'loading',
            content: 'Publishing...',
            duration: 0
        });

        try {
            if (account) {
                await createPostOperation(
                    "",
                    values.url,
                    values.name,
                    values.type,
                    values.amount,
                )

            } else {
                await onConnectWallet();
                await createPostOperation(
                    "",
                    values.url,
                    values.name,
                    values.type,
                    values.amount,
                )

            }

            messageApi.open({
                key: '1',
                type: 'success',
                content: <>Published <a className='text-blue-600' href='https://better-call.dev/ghostnet/KT1HVmxrBy4FMiSHhjpHARfmkrmG6VSi2Ajm/operations'>View</a></>,
                duration: 10,
            });



        } catch (error) {
            messageApi.open({
                key: '1',
                type: 'error',
                content: 'Failed Publishing',
                duration: 5,
            });

        }


        setLoading(false);
        console.log(values);
        handleReset();
    };


    const handleReset = () => {
        form.resetFields();
    };

    const onChangeInput = (value) => {

        console.log(value);
        setAmt(value);

    };

    const onChangeImgUrl = (e) => {
        console.log(e.target.value);
        setImgUrl(e.target.value);
    }

    const onClose = () => {
        setImgUrl(null);

    }

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };



    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd');
                const data = await response.json();
                const tezosPriceInUSD = data.tezos.usd;
                setPrice(tezosPriceInUSD);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPrice();
        const intervalId = setInterval(fetchPrice, 60000); // Update price every 60 seconds
        return () => clearInterval(intervalId);
    }, []);


    const router = useRouter();
    return (

        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,

            }}
        >
            {contextHolder}
            <div className='min-h-screen p-2 bg-black'>
                <Button className='fixed hidden md:block left-4 top-8' onClick={() => router.push('/')} size='large' type="link">&#8592; Back to Home</Button>
                <h1 className='my-8 text-center mt-6 text-white font-bold font-mono text-2xl md:text-4xl' >Create a New Campaign <NotificationOutlined /></h1>

                <div className=" flex gap-4 p-4 flex-col w-full items-center justify-center ">

                    <div className='relative flex gap-2 justify-center max-w-2xl  overflow-hidden '>
                        {imgUrl &&
                            <>
                                <Image
                                    height={192}
                                    src={imgUrl}
                                    fallback="https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png"

                                />
                                <Button onClick={onClose} icon={<CloseOutlined />} className='absolute right-2 top-2 ' type="primary" danger />
                            </>
                        }
                    </div>



                    <Form
                        {...layout}
                        form={form}
                        labelWrap

                        size='large'


                        onFinish={onFinish}
                        className="mt-4 md:mt-4 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-4 ring-1  shadow-slate-800 shadow-lg rounded-lg"
                    >
                        <Form.Item
                            name={'name'}
                            label="Campaign Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}


                        >
                            <Input placeholder='Title...' />
                        </Form.Item>
                        <Form.Item
                            name={'amount'}
                            label="Target Amount"
                            rules={[{ required: true }]}


                        >
                            <Space>
                                <InputNumber step="0.5" min={0} addonAfter="XTZ" onChange={onChangeInput} defaultValue={0} />
                                <InputNumber
                                    className='w-full'
                                    prefix="$"
                                    value={price * amt}
                                    controls={false}
                                    readOnly
                                    defaultValue={3}

                                />
                            </Space>

                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="Image URL"
                            rules={[{ required: true }, { type: 'url', warningOnly: true },]}


                        >
                            <Input value={imgUrl} onChange={onChangeImgUrl} />
                        </Form.Item>
                        <Form.Item
                            name="upload"
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}

                        >
                            <Upload maxCount={1} name="cover" listType="picture">
                                <Button className='' icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name={'description'}
                            label="Campaign Description"
                            rules={[{ required: true }]}

                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Campaign Type"
                            rules={[{ required: true }]}

                        >
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'Other',
                                        label: 'Other',
                                    },
                                    {
                                        value: 'Crowdfunding',
                                        label: 'Crowdfunding',
                                    },
                                    {
                                        value: 'Charity',
                                        label: 'Charity',
                                    },
                                    {
                                        value: 'Investment',
                                        label: 'Investment',
                                    },
                                    {
                                        value: 'Donation',
                                        label: 'Donation',
                                    },
                                    {
                                        value: 'Lending',
                                        label: 'Lending',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                ...layout.wrapperCol,
                                offset: 10,
                            }}

                        >
                            <Space>
                                <Button loading={loading} className=" bg-blue-600 " type="primary" htmlType="submit">
                                    Publish
                                </Button>
                                <Button onClick={handleReset} className=" " >
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>

                    </Form>

                </div>
            </div>
        </ConfigProvider>
    )
}
