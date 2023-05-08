'use client';
import React, { useState, useEffect } from 'react'
import CampaignCard from './CampaignCard';
import { fetchStorage } from '@/utils/tzkt';
import axios from "axios";
import { create } from "ipfs-http-client";

import { Select } from 'antd';

var Buffer = require('buffer/').Buffer
const infuraApiKey = '2Ow0S5v4gpn9zS7dlv448fKFYG0'
const infuraApiSecret = '7edd32513089c463c741160b6bd08937'
const auth = 'Basic ' + Buffer.from(infuraApiKey + ':' + infuraApiSecret).toString('base64');

export default function Reportpage() {
    const [campaigns, setCampaigns] = useState([]);
    const [ipfs, setIpfs] = useState(null);

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    async function fetchIpfsData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const ipfsNode = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: auth,
            },
        });
        setIpfs(ipfsNode);
    }, [])


    useEffect(() => {

        (async () => {
            const storage = await fetchStorage();
            var id = storage.posts;
            const res = await axios.get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${id}/keys`);
            let temp = res.data;
            console.log("Data", temp);
            setCampaigns(res.data);
            //const data = await fetchIpfsData(res.data.value.ipfs_url);

        })();

    }, []);

    return (
        <>

            <div className='flex-1 w-full p-4 flex flex-col  items-center justify-center  bg-gradient-to-r bg-black'>
                <div className='flex justify-center items-center w-full p-2 '>
                    <Select
                        className='max-w-sm'
                        size='large'
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: 'jack',
                                label: 'Jack',
                            },
                            {
                                value: 'lucy',
                                label: 'Lucy',
                            },
                            {
                                value: 'tom',
                                label: 'Tom',
                            },
                        ]}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

                    {campaigns?.map((campaign) => {
                        return (
                            <CampaignCard
                                key={campaign.value.id}
                                campaign={campaign}
                            />

                        )
                    })}

                </div>
            </div>
        </>
    )
}