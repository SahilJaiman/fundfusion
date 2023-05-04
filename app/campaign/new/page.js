'use client';
import React, { useState, useEffect } from 'react'
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
    Breadcrumb
} from 'antd';
import { ConfigProvider, theme } from 'antd';
import { NotificationOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAccount, connectWallet } from '@/utils/wallet';
import { useForm } from 'antd/lib/form/Form';
import { createPostOperation } from '@/utils/operation';


//IPFS


import ConnectWallet from '@/components/ConnectWallet';
import { contractAddress } from '@/utils/contract';




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

    const [ipfsContent, setIpfsContent] = useState(null);
    const [value, setValue] = useState();



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
            const ipfsContentLink = await uploadContent(value);
           
            try {
                if (account) {
                    await createPostOperation(
                        "",
                        values.url,
                        values.name,
                        values.description,                        
                        values.type,
                        values.amount,
                    )

                } else {
                    await onConnectWallet();
                    await createPostOperation(
                        "",
                        values.url,
                        values.name,
                        values.description,  
                        values.type,
                        values.amount,
                    )

                }

                messageApi.open({
                    key: '1',
                    type: 'success',
                    content: <>Published <a className='text-blue-600' href={`https://better-call.dev/ghostnet/${contractAddress}/operations`}>View</a></>,
                    duration: 10,
                });



            } catch (error) {
                messageApi.open({
                    key: '1',
                    type: 'error',
                    content: `Failed Publishing,${error}`,
                    duration: 5,
                });

            }
        } catch (error) {
            console.error("Content uploading error : ", err);
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

    


    const handleReset = () => {
        form.resetFields();
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

        

        fetchPrice();
    
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
            
            <div className='min-h-screen p-4 relative flex flex-col bg-black'>

             

                <h1 className='mb-4 text-center mt-8 text-white font-bold font-mono text-2xl md:text-4xl' >Create a New Campaign <NotificationOutlined /></h1>

                <div className="flex  gap-4 mb-12 flex-col w-full items-center justify-center ">
                    <div className='flex  p-2 justify-start'>
                        <Breadcrumb
                       
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
                        />
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

                        <ConnectWallet/>

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
                            <Upload maxCount={1} name="cover" listType="picture" beforeUpload={() => false} >
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
                            className='flex justify-center'

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
