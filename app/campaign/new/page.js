'use client';
import React, { useState, useEffect,useRef } from 'react'
import {
    Button,
    Form,
    Input,
    Select,
    InputNumber,
    Space,
    Image,
    Upload,
    message,
    Breadcrumb,
    Steps,
} from 'antd';
import { ConfigProvider, theme } from 'antd';
import { NotificationOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAccount, connectWallet } from '@/utils/wallet';
import { useForm } from 'antd/lib/form/Form';
import { createPostOperation } from '@/utils/operation';


import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

//IPFS
import { create } from 'ipfs-http-client'

const infuraApiKey = '2Ow0S5v4gpn9zS7dlv448fKFYG0'
const infuraApiSecret = '7edd32513089c463c741160b6bd08937'
const auth = 'Basic ' + Buffer.from(infuraApiKey + ':' + infuraApiSecret).toString('base64');


import ConnectWallet from '@/components/ConnectWallet';
import { contractAddress } from '@/utils/contract';

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);


const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 20,
    },
};

const description = '';

export default function NewCampaign() {

    const divRef = useRef(null);
    const router = useRouter();

    const [height, setHeight] = useState(100);

    const [form] = useForm();
    const [XTZPrice, setXTZPrice] = useState(null);
    const [amt, setAmt] = useState(0);
    const [imgUrl, setImgUrl] = useState("");
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [ipfs, setIpfs] = useState(null);
    const [ipfsContent, setIpfsContent] = useState(null);
    const [value, setValue] = useState();

    const [publishing, setPublishing] = useState('wait');
    const [uploadingToIpfs, setUploadingToIpfs] = useState('wait');
    const [uploadingToContract, setUploadingToContract] = useState('wait');
    const [completed, setCompleted] = useState('wait');



    const onConnectWallet = async () => {
        await connectWallet();
        const activeAccount = await getAccount();
        setAccount(activeAccount);
    };


    const onFinish = async (values) => {
        setPublishing('finish')
        setLoading(true);
        messageApi.open({
            key: '1',
            type: 'loading',
            content: 'Publishing...',
            duration: 0
        });

        try {
            const ipfsContentLink = await uploadContent(value);

            try {
                setUploadingToContract('process')
                if (account) {
                    await createPostOperation(
                        ipfsContentLink,
                        values.url,
                        values.name,
                        values.description,
                        values.type,
                        values.amount,
                    )

                } else {
                    await onConnectWallet();
                    await createPostOperation(
                        ipfsContentLink,
                        values.url,
                        values.name,
                        values.description,
                        values.type,
                        values.amount,
                    )

                }
                setUploadingToContract('finish')
                setCompleted('finish')
                messageApi.open({
                    key: '1',
                    type: 'success',
                    content: <>Published <a className='text-blue-600' href={`https://better-call.dev/ghostnet/${contractAddress}/operations`}>View</a></>,
                    duration: 10,
                });



            } catch (error) {
                setUploadingToContract('error')
                messageApi.open({
                    key: '1',
                    type: 'error',
                    content: `Failed Publishing,${error}`,
                    duration: 5,
                });

            }
        } catch (error) {
            setUploadingToIpfs('error')
            console.error("Content uploading error : ", error);
            messageApi.open({
                key: '1',
                type: 'error',
                content: 'Failed Publishing',
                duration: 5,
            });
        }


        setLoading(false);
        console.log(values);
        //handleReset();
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

    const uploadContent = async (htmlString) => {
        if (htmlString) {
            setUploadingToIpfs('process')
            try {
                messageApi.open({
                    key: '3',
                    type: 'loading',
                    content: 'Uploading Content to IPFS...',
                    duration: 0
                });
                const json = {
                    html: htmlString
                };
                const uploadResponse = await ipfs.add(JSON.stringify(json));
                const ipfsLink = `https://ipfs.io/ipfs/${uploadResponse.cid.toString()}`;

                setIpfsContent(ipfsLink);
                messageApi.open({
                    key: '3',
                    type: 'success',
                    content: `Content Uploaded successfully to IPFS`,
                    duration: 5
                });
                setUploadingToIpfs('finish');
                return ipfsLink;
            } catch (err) {
                setUploadingToIpfs('error');
                console.error("IPFS error : ", err);
                messageApi.open({
                    key: '3',
                    type: 'error',
                    content: 'Failed to upload content to IPFS',
                    duration: 5,
                });

            }
        }

    };




    const handleReset = () => {
        form.resetFields();
        setPublishing('wait');
        setUploadingToIpfs('wait');
        setUploadingToContract('wait')
        setCompleted('wait');
    };

    const onChangeInput = (value) => {

        setAmt(value);

    };

    const onChangeImgUrl = (e) => {

        setImgUrl(e.target.value);
    }

    const onClose = () => {
        setImgUrl("");
    }

    const normFile = (e) => {

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
                console.log(tezosPriceInUSD);
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

    useEffect(() => {
        if (divRef.current) {
          setHeight(divRef.current.clientHeight);
        }
      }, [divRef]);









    return (

        <>
            {contextHolder}

            <div className='flex-1 w-full  p-4 relative flex flex-col bg-black'>


                <div className='flex mb-4 mt-4  justify-center'>
                    <h1 className='text-center shadow-md transition hover:scale-[1.01] shadow-slate-400 text-gray-900  bg-white hover:bg-gray-100 ring-2 border-gray-200  dark:bg-gray-800 dark:border-gray-700 dark:text-white  rounded-xl backdrop-blur-xl px-4 py-2.5 font-bold font-mono text-2xl lg:text-3xl' >Create a New Campaign </h1>
                </div>
                <div className="flex  rounded-lg  gap-4  flex-col w-full items-center justify-center p-4 ">
                    <div className='flex mt-4 lg:w-1/2 w-full md:w-full  p-2 justify-start '>
                        <Steps
                            current={1}
                            items={[
                                {
                                    title: 'Publishing',
                                    description,
                                    status: publishing,
                                },
                                {
                                    title: 'Ipfs',
                                    description,
                                    status: uploadingToIpfs,

                                },
                                {
                                    title: 'Smart Contract',
                                    description,
                                    status: uploadingToContract,
                                },
                                {
                                    title: 'Published',
                                    description,
                                    status: completed,
                                }
                            ]}
                        />
                        {/* <Breadcrumb
                            className='text-lg'
                            separator="/"
                            items={[
                                {

                                    title: <a onClick={() => router.push('/')} >Home</a>
                                },
                                {
                                    title: <a onClick={() => router.push('/')}>Campaign</a>
                                },
                                {
                                    title: <a onClick={() => router.push('/campaign/new')}>New</a>
                                },

                            ]}
                        /> */}
                    </div>

               

                    <div className='relative  flex gap-2 justify-center max-w-2xl  overflow-hidden '>
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

                    <div  className='flex flex-col gap-4 lg:gap-2 lg:flex-row w-full h-full items-center justify-between'>

                        <div  className=" ring-2 table sm:max-w-2xl md:max-w-4xl lg:w-full p-4 rounded-lg" >
                            <Form
                                {...layout}
                                form={form}
                                labelWrap

                                size='large'


                                onFinish={onFinish}
                                

                            >


                                <div ref={divRef} className='w-full p-4 rounded-lg'>

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
                                        className='flex rounded-lg justify-center'

                                    >
                                        <Space size={'large'}>
                                            <Button loading={loading} className=" bg-blue-600 " type="primary" htmlType="submit">
                                                Publish
                                            </Button>
                                            <Button onClick={handleReset} className="" >
                                                Reset
                                            </Button>
                                        </Space>



                                    </Form.Item>
                                </div>

                            </Form>
                        </div>

                        <div  data-color-mode="dark" className='w-full self-stretch ring-2 p-4 rounded-lg'>
                            <MDEditor

                                height={height-8}
                                value={value}
                                onChange={setValue}

                            />

                        </div>

                    </div>






                </div>
            </div>


        </>
    )
}
