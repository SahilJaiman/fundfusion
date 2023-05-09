import React, { useEffect, useState } from 'react'
import { Tooltip, Progress, Modal, InputNumber, Col, Statistic, message, Button } from "antd";
import { getAccount } from '@/utils/wallet';
import { fetchPrice } from '@/app/api/tezos';
import { withdrawOperation } from '@/utils/operation';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function AuthorCard({ id, author,fundRaised,total_withdraw_amt }) {

    const [disable, setDisable] = useState(false);
    const [account, setAccount] = useState(null);

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


    useEffect(() => {
        (async () => {
            const activeAccount = await getAccount();
            setAccount(activeAccount)
        })();

    }, []);

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

    const onWithdraw = async (amt) => {

        try {

            setLoading(true);

            messageApi.open({
                key: '1',
                type: 'loading',
                content: 'Withdrawing your amount...',
                duration: 0
            });

            await withdrawOperation(id, amt);

            messageApi.open({
                key: '1',
                type: 'success',
                content: 'Withdrawal successful!',
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

    return (
        <>
            {contextHolder}

            <div className="flex flex-col mt-2 gap-4 w-full p-4 sm:p-6 max-w-sm sm:max-w-2xl bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 ">
                <p className="flex-1 flex space-x-2 text-xl justify-between  font-bold font-mono text-white">
                    <span>Author</span>
                    <Tooltip title="View all transactions related to author, including contribution received.">
                        <span className="font-normal text-gray-400 font-mono hover:text-blue-600 ">
                            <a target="_blank" rel="noopener noreferrer" style={{ display: "table-cell" }} href={`https://ghostnet.tzkt.io/${author}/operations/`}>{author?.slice(0, 5) + " ... " + author?.slice(-5)}</a>
                        </span>
                    </Tooltip>
                </p>
                <div className='w-full'>
                    <Button onClick={showModal} disabled={account != author} size='large' className='bg-blue-600' block type="primary">Withdraw</Button>
                </div>

            </div>

            <Modal
                title={<div className="text-lg sm:text-xl text-center font-bold ">Confirm Withdrawal of Funds</div>}
                centered
                open={isModalOpen}

                onCancel={handleCancel}
                okText="Withdraw"
                confirmLoading={isLoading}
                onOk={() => onWithdraw(inputValue)}

            >

                <div className="flex flex-col p-4 gap-4">

                    <div>
                        <div className="text-xl font-semibold">Select the amount</div>
                        <div>We hope that these funds will help you achieve your goals for the campaign. Please use them with care and responsibility.</div>
                    </div>


                    <div className="flex flex-row">
                        <Col className="w-3/4 items-center flex ">
                            <Slider
                                min={0}
                                max={(fundRaised-total_withdraw_amt) / 1000000}
                                value={inputValue}
                                onChange={onChange}
                                tipFormatter={tipFormatter}
                            />


                        </Col>
                        <Col className="w-1/4 ml-4">
                            <InputNumber
                                min={1}
                                max={(fundRaised-total_withdraw_amt) / 1000000}
                                step={((fundRaised-total_withdraw_amt) / 1000000) * 0.01}
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
}
