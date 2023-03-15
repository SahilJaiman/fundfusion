'use client';
import React from 'react'
import { Button, Form, Input, Select, InputNumber } from 'antd';
import { message, ConfigProvider, theme } from 'antd';
import { NotificationOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import FormItem from 'antd/es/form/FormItem';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

const onFinish = (values) => {
    console.log(values);
};

export default function NewCampaign() {

    const router = useRouter();
    return (



        <div className="min-h-screen p-2 bg-black  w-full items-center flex  flex-col justify-center ">
            <Button onClick={() => router.push('/')} size='large' type="link">&#8592; Back to Home</Button>
            <h1 className=' text-white font-bold font-mono text-2xl md:text-4xl' >Create a New Campaign <NotificationOutlined /></h1>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,

                }}
            >
                <Form
                    {...layout}

                    size='large'


                    onFinish={onFinish}
                    className="mt-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 ring-1  shadow-slate-800 shadow-lg rounded-lg"
                >
                    <Form.Item
                        name={['user', 'name']}
                        label="Campaign Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}


                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={'amount'}
                        label="Target Amount"
                        rules={[{ required: true }]}


                    >
                        <InputNumber addonAfter="ETH" defaultValue={0} />

                    </Form.Item>

                    <Form.Item
                        name="url"
                        label="Image URL"
                        rules={[{ required: true }, { type: 'url', warningOnly: true },]}

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'introduction']} label="Campaign Description">
                        <Input.TextArea />
                    </Form.Item>
                    <FormItem
                         name="type"
                         label="Campaign Type"
                        
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
                                    value: '1',
                                    label: 'Other',
                                },
                                {
                                    value: '2',
                                    label: 'Crowdfunding',
                                },
                                {
                                    value: '3',
                                    label: 'Charity',
                                },
                                {
                                    value: '4',
                                    label: 'Investment',
                                },
                                {
                                    value: '5',
                                    label: 'Donation',
                                },
                                {
                                    value: '6',
                                    label: 'Lending',
                                },
                            ]}
                        />
                    </FormItem>
                    <Form.Item
                        wrapperCol={{
                            ...layout.wrapperCol,
                            offset: 8,
                        }}
                    >
                        <Button className=" bg-blue-600 " type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
            </ConfigProvider >
        </div>

    )
}
