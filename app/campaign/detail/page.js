'use client';
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';

import Card from './card';
import CampaignOutput from './campaignOutput';
import Vote from './vote';
import { fetchStorage } from '@/utils/tzkt';
import axios from "axios";
import { Tooltip, Button } from 'antd';
import AuthorCard from './authorCard';



export default function CampaignPage() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get('id');

    const [campaign, setCampaign] = useState([]);
    const [content, setContent] = useState(``);

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

        (async () => {
            const storage = await fetchStorage();
            var id = storage.posts;
            const res = await axios.get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${id}/keys/${campaignId}`);
            let temp = res.data;
            setCampaign(res.data.value);
            const data = await fetchIpfsData(res.data.value.content_url);
            setContent(data);

        })();

    }, [campaignId]);

    useEffect(() => {
        console.log("Camapaign", campaign);
    }, [campaign])





    return (
        <div className='flex-1 p-2 sm:p-4 flex flex-col  items-center justify-start bg-black'>

            <div className="px-4 w-full max-w-sm md:max-w-lg py-4 mt-4 font-bold text-center font-serif text-xl shadow-xs shadow-slate-300 rounded-lg text-white md:text-3xl ring-2 ">{campaign.title}</div>

            <div className='  gap-8 p-2 sm:p-4 w-full flex flex-col justify-start lg:flex-row lg:justify-center mt-4  '>
                {/* LEFT SIDE */}
                <div className='w-full border-2 border-slate-600 rounded-lg bg-slate-800 lg:w-2/3 flex flex-col justify-start items-center p-4' >
                    {/*  IMAGE  */}
                    <div className='w-full ring-2  rounded-lg h-64 overflow-hidden relative  group '>
                        <img className='absolute w-full h-full transition-transform duration-300 transform group-hover:scale-110  object-cover '
                            src={campaign.thumbnail_url}
                            alt="Campaign Thumbnail"
                        />

                    </div>
                    {/* CONTENT */}
                    <div className='overflow-auto w-full self-stretch mt-4 rounded-xl'>
                        <CampaignOutput content={content} />
                    </div>
                </div>
                {/* RIGHT SIDE*/}
                <div className='w-full md:flex-1 p-2 flex md:flex-col md:justify-start items-center justify-center '>
                    <div className='md:sticky w-full flex flex-col justify-center items-center gap-6 top-20 '>
                        <Vote />
                        {/* Author */}

                        <AuthorCard author={campaign.author} />
                        <Card
                            id={campaign.id}
                            author={campaign.author}
                            contributors={campaign.contributors}
                            fundRaised={campaign.fundraised}
                            totalFund={campaign.fundraising_goal}
                        />

                    </div>
                </div>

            </div>


        </div>

    )
}