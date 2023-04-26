'use client';
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Select, InputNumber, Descriptions, Space, Image, Upload, message } from 'antd';
import { ConfigProvider, theme } from 'antd';
import { NotificationOutlined, ArrowLeftOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAccount, connectWallet } from '@/utils/wallet';
import { useForm } from 'antd/lib/form/Form';
import { createPostOperation } from '@/utils/operation';

//IPFS
import { create } from "ipfs-http-client";
var Buffer = require('buffer/').Buffer
const infuraApiKey = '2Ow0S5v4gpn9zS7dlv448fKFYG0'
const infuraApiSecret = '7edd32513089c463c741160b6bd08937'
const auth = 'Basic ' + Buffer.from(infuraApiKey + ':' + infuraApiSecret).toString('base64');


import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);
const EditerMarkdown = dynamic(
    () =>
        import("@uiw/react-md-editor").then((mod) => {
            return mod.default.Markdown;
        }),
    { ssr: false }
);
const Markdown = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
);

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
    const [XTZPrice, setXTZPrice] = useState(null);
    const [amt, setAmt] = useState(0);
    const [imgUrl, setImgUrl] = useState("");
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [ipfs, setIpfs] = useState(undefined);
    const [value, setValue] = useState('**Sahil**');


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

    const handleUpload = async (info) => {
        const fileList = info.fileList;
        const latestFile = fileList[fileList.length - 1];
        if (latestFile) {
            try {
                messageApi.open({
                    key: '2',
                    type: 'loading',
                    content: 'Uploading to IPFS...',
                    duration: 0
                });
                const uploadResponse = await ipfs.add(latestFile.originFileObj);
                const ipfsLink = `https://ipfs.io/ipfs/${uploadResponse.cid.toString()}`;
                console.log(ipfsLink);
                setImgUrl(ipfsLink);
                messageApi.open({
                    key: '2',
                    type: 'success',
                    content: `${latestFile.name} Uploaded successfully to IPFS`,
                    duration: 5
                });
            } catch (err) {
                console.error("IPFS error : ", err);
                messageApi.open({
                    key: '2',
                    type: 'error',
                    content: 'Failed to upload file to IPFS',
                    duration: 5,
                });

            }
        }

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
        setImgUrl("");
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
                setXTZPrice(tezosPriceInUSD);
            } catch (error) {
                console.error(error);
            }
        };

        const connectToIpfs = async () => {
            const ipfsNode = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth,
                },
            });
            setIpfs(ipfsNode);

        }

        fetchPrice();
        connectToIpfs();
        const intervalId = setInterval(fetchPrice, 60000);
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
            <div className='min-h-screen'>

                {contextHolder}
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
                                <Button onClick={onClose} icon={<CloseOutlined />} className='absolute right-2 top-2 flex items-center justify-center  ' type="primary" danger />
                            </>
                        }
                    </div>



                    <Form
                        {...layout}
                        form={form}
                        labelWrap

                        size='large'


                        onFinish={onFinish}
                        className="mt-4 md:mt-4 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-8 ring-1  shadow-slate-800 shadow-lg rounded-lg"
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
                                    value={XTZPrice * amt}
                                    controls={false}
                                    readOnly
                                    defaultValue={3}
                                    formatter={value => `${Number(value).toFixed(3)}`}

                                />
                            </Space>

                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="Image URL"
                            rules={[{ required: true }, { type: 'url', warningOnly: true },]}


                        >
                            <Input value={imgUrl} onChange={onChangeImgUrl} allowClear />

                        </Form.Item>
                        <Form.Item
                            name="upload"
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}

                        >
                            <Upload maxCount={1} name="cover" listType="picture" beforeUpload={() => false} onChange={handleUpload}>
                                <Button className="flex items-center justify-center" icon={<UploadOutlined className="" />}>
                                    Click to upload
                                </Button>
                            </Upload>

                        </Form.Item>
                        <Form.Item
                            name={'description'}
                            label="Campaign Description"
                            rules={[{ required: true }]}

                        >
                            <Input.TextArea />
                        </Form.Item>


                        <div className='my-4'>
                            <MDEditor
                                value={value}
                                onChange={setValue}
                                
                            />


                        </div>


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
