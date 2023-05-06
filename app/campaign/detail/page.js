'use client';
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Card from './card';
import CampaignOutput from './campaignOutput';
import Vote from './vote';
import { fetchStorage } from '@/utils/tzkt';
import axios from "axios";


import { create } from "ipfs-http-client";

var Buffer = require('buffer/').Buffer
const infuraApiKey = '2Ow0S5v4gpn9zS7dlv448fKFYG0'
const infuraApiSecret = '7edd32513089c463c741160b6bd08937'
const auth = 'Basic ' + Buffer.from(infuraApiKey + ':' + infuraApiSecret).toString('base64');

export default function Postpage() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get('id');

    const [campaign, setCampaign] = useState([]);
    const [ipfs, setIpfs] = useState(null);
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
            const res = await axios.get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${id}/keys/${campaignId}`);
            let temp = res.data;
            console.log("Data", temp);
            setCampaign(res.data.value);
            const data = await fetchIpfsData(res.data.value.content_url);
            console.log("IPFS data->", data);
            setContent(data);

        })();

    }, [campaignId]);

    useEffect(() => {
        console.log("Camapaign", campaign);
    }, [campaign])





    return (
        <div className='min-h-screen p-4  lg:flex flex-col  items-center justify-start bg-gradient-to-r from-gray-700 via-gray-900 to-black'>

            <h1 class="mb-4 w-full font-extrabold sm:text-center text-xl bg-clip-text text-transparent bg-gradient-to-b from-sky-400 to-sky-200 sm:p-2 md:py-4
  md:text-4xl lg:text-4xl xl:text-4xl
">{campaign.title}</h1>

            <div className=' rounded-xl gap-16 p-6  w-full  sm:flex sm:flex-col  md:flex md:flex-row  '>
                {/* LEFT SIDE */}
                <div className='w-full  flex flex-col justify-start items-center' >
                    {/*  IMAGE  */}
                    <div className='ring-4 h-[300px] w-[600px] overflow-hidden relative rounded-xl group '>
                        <img className='absolute w-full h-full transition-transform duration-300 transform group-hover:scale-110  object-cover '
                            src={campaign.thumbnail_url}
                        />

                    </div>
                    {/* CONTENT */}
                    <div className='overflow-auto w-3/4 ring-4 mt-4 rounded-xl'>


                        <CampaignOutput content={content} />


                    </div>
                </div>
                {/* RIGHT SIDE*/}
                <div className='md:flex md:flex-col md:justify-start sm:items-center sm:justify-center sm:mt-4 '>
                    <div className='md:sticky flex flex-col md:gap-6 top-16 '>
                        <Card
                            fundRaised={campaign.fundraised}
                            totalFund={campaign.fundraising_goal}
                        />
                        <Vote />
                    </div>
                </div>

            </div>


        </div>

    )
}