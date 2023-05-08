'use client';
import React, { useState, useEffect } from "react";
import { InfoCircleFilled } from "@ant-design/icons";
import { Tooltip, Progress, ConfigProvider, theme, Modal, InputNumber, Row, Col, Statistic, message } from "antd";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchPrice } from "@/app/api/tezos";
import { sendTipOperation } from "@/utils/operation";
import "./style.css"

export default function Card(props) {




    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [XTZPrice, setXTZPrice] = useState(0);
    useEffect(() => {
        async function fetchData() {
            const { price } = await fetchPrice();
            setXTZPrice(price);
        }

        fetchData();
    }, []);

    const onSend = async (amt) => {

        try {

            setLoading(true);

            messageApi.open({
                key: '1',
                type: 'loading',
                content: 'Sending your contribution...',
                duration: 0
            });

            await sendTipOperation(props.id, amt);

            messageApi.open({
                key: '1',
                type: 'success',
                content: 'Thanks for your contribution.',
                duration: 10
            });
            setLoading(false);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 2000);
        } catch (error) {


            messageApi.open({
                key: '1',
                type: 'error',
                content: 'Oops, Please try again.',
                duration: 10
            });

            setLoading(false);

        }

    }

    const onChange = (newValue) => {
        setInputValue(newValue);
    };
    const tipFormatter = (value) => {
        return `Value: ${value}`;
    };

    const showModal = () => {
        setIsModalOpen(true);
    };



    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const contributorsList = props.contributors ? Object.entries(props.contributors) : [];
    return (
        <>
            {contextHolder}

            <div className='w-full max-w-sm sm:max-w-2xl py-2 px-4  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
                <div className='flex flex-col  p-2'>
                    <span className='text-xl  font-bold font-mono text-white'>
                        Campaign Balance
                        <Tooltip title="The balance is how much money this campaign has raised.">
                            <InfoCircleFilled className="ml-2 w-4 h-4" />
                        </Tooltip>
                    </span>


                    <div className="flex flex-col items-start justify-center ">
                        <div className="font-mono flex space-x-2 text-white text-2xl font-extrabold text-center"><span>{Math.round(props.fundRaised / 1000000)}</span> <img className="w-4" src='/tezos.svg' /></div>
                        <div className="text-gray-500 dark:text-gray-400 font-mono ">Raised of {Math.round(props.totalFund / 1000000)}</div>
                    </div>

                    <Progress percent={Math.round((props.fundRaised) * 100 / props.totalFund)} status="active" />

           

                </div>


                <button onClick={showModal} type="button" className="text-gray-900 text-lg font-bold flex-row justify-center bg-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-lg  px-7 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500  w-full">

                    Contribute Now
                </button>
                <br />
                <div className="flex items-center justify-between mt-2 p-2">
                    <h5 className="text-xl font-mono font-bold leading-none text-gray-900 dark:text-white">Recent Contributors</h5>

                </div>

                <div className=" max-h-40 overflow-auto space-y-2 p-2 ">
                    {

                        contributorsList?.reverse().map(([key, value]) => (

                            <ul key={key} role="list" className="">
                                <li className="items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-shrink-0">
                                            <img className="w-8 h-8 rounded-full " src="/7309681.jpg" alt="Neil image" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {key.slice(0, 10) + " ... " + key.slice(-4)}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center  text-base font-semibold text-gray-900 dark:text-white">
                                            {Math.round(value / 1000000)} <img className='w-4 h-4 ml-2' src='/tezos.svg' />
                                        </div>
                                    </div>
                                </li>

                            </ul>
                        ))
                    }
                </div>

            </div>

            <Modal
                title={<div className="text-lg sm:text-xl text-center font-bold ">Join us in making a difference !</div>}
                centered
                open={isModalOpen}

                onCancel={handleCancel}
                okText="Send"
                confirmLoading={isLoading}
                onOk={() => onSend(inputValue)}

            >

                <div className="flex flex-col p-4 gap-4">

                    <div>
                        <div className="text-xl font-semibold">Select the amount</div>
                        <div>Join us in making a difference and create positive impact on the world.</div>
                    </div>


                    <div className="flex flex-row">
                        <Col className="w-3/4 items-center flex ">
                            <Slider
                                min={0}
                                max={(props.totalFund - props.fundRaised) / 1000000}
                                value={inputValue}
                                onChange={onChange}
                                tipFormatter={tipFormatter}
                            />


                        </Col>
                        <Col className="w-1/4 ml-4">
                            <InputNumber
                                min={1}
                                max={(props.totalFund - props.fundRaised) / 1000000}
                                step={((props.totalFund - props.fundRaised) / 1000000) * 0.01}
                                prefix={<img className="w-4 h-4" src="/tezos.svg" ></img>}
                                precision={0}
                                value={inputValue}
                                onChange={onChange}
                            />
                        </Col>
                    </div>
                    <div className="font-mono">
                        <Statistic title="Dollar (USD)" prefix={"$"} value={Number(inputValue * XTZPrice)} precision={2} />

                    </div>
                </div>


            </Modal >
        </>


    )
};