'use client';
import React from 'react'
import { Button, Form, Input, InputNumber } from 'antd';
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
    return (
        <div className="min-h-screen border-2 w-full items-center flex justify-center ">
            <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
             
                validateMessages={validateMessages}
                className=" p-4 w-[600px] shadow-lg rounded-lg"
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
                    name={['user', 'email']}
                    label="Target Amount"
                   
                >
                    <InputNumber />
                </Form.Item>
               
                <Form.Item name={['user', 'website']} label="Image URL">
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'introduction']} label="Campaign Description">
                    <Input.TextArea />
                </Form.Item>
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
        </div>
    )
}
