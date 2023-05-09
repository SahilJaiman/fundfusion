'use client';
import React, { useState, useEffect } from 'react'
import CampaignCard from './CampaignCard';
import { fetchStorage } from '@/utils/tzkt';
import axios from "axios";

import { Select, Empty } from 'antd';


const campaignTypes = [
    {
        value: 'All',
        label: 'All',
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
]

export default function Reportpage() {
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState(['All']);
    const [loading, setLoading] = useState(false);


    const onChange = (value) => {
        setLoading(true);
        if (value.includes('All') || value.length == 0) {
            setFilteredCampaigns(campaigns);
            setLoading(false);
            return;
        }
        setSelectedTypes(value);
        const newfilteredCampaigns = campaigns.filter((campaign) => value.includes(campaign.value.type));
        setFilteredCampaigns(newfilteredCampaigns);
        setLoading(false);

    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    useEffect(() => {
        console.log("Filterd ", filteredCampaigns);
    }, [filteredCampaigns])

    useEffect(() => {

        (async () => {
            try {
                const storage = await fetchStorage();
                var id = storage.posts;
                const res = await axios.get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${id}/keys`);
                let temp = res.data;
                console.log("Data", temp);
                setCampaigns(res.data);
                setFilteredCampaigns(res.data)


            } catch (error) {

            }

        })();

    }, []);

    return (
        <>

            <div className='flex-1 w-full p-4 flex flex-col  items-center   bg-gradient-to-r bg-black'>
                <div className='flex justify-center items-center w-full p-2 '>
                    <Select
                        className='w-full max-w-sm sm:max-w-md md:max-w-lg'
                        mode="multiple"
                        allowClear
                        size='large'
                        showSearch
                        placeholder="Select Category"
                        defaultValue={'All'}
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={campaignTypes}
                        loading={loading}
                    />
                </div>

                {filteredCampaigns.length == 0 ?
                    <div className='flex flex-1 justify-center items-center'>
                        <Empty />
                    </div>

                    :

                    < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

                        {filteredCampaigns?.map((campaign) => {
                            return (
                                <CampaignCard
                                    key={campaign.value.id}
                                    campaign={campaign}
                                />

                            )
                        })}

                    </div>
                }
            </div >
        </>
    )
}