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
        <div className='flex-1 p-2 sm:p-4 flex flex-col  items-center justify-start bg-black'>

            <div class="px-2 py-4 font-bold text-center font-serif text-xl shadow-md shadow-slate-300 rounded-lg text-white bg-slate-800 md:text-3xl ring-2 ">{campaign.title}</div>

            <div className='  gap-8 p-2 sm:p-4 w-full flex flex-col justify-start md:flex-row mt-8  '>
                {/* LEFT SIDE */}
                <div className='w-full border-2 border-slate-600 rounded-lg bg-slate-800 md:w-2/3 flex flex-col justify-start items-center p-4' >
                    {/*  IMAGE  */}
                    <div className='w-full ring-2  rounded-lg h-64 overflow-hidden relative  group '>
                        <img className='absolute w-full h-full transition-transform duration-300 transform group-hover:scale-110  object-cover '
                            src={campaign.thumbnail_url}
                            alt="Campaign Thumbnail"
                        />

                    </div>
                    {/* CONTENT */}
                    <div className='overflow-auto mt-4 rounded-xl'>
                        <CampaignOutput content={content} />
                    </div>
                </div>
                {/* RIGHT SIDE*/}
                <div className='w-full md:flex-1 p-2 flex md:flex-col md:justify-start items-center justify-center '>
                    <div className='md:sticky w-full flex flex-col justify-center items-center gap-6 top-20 '>
                        <Vote />
                        <div className="w-full p-4 max-w-sm sm:max-w-xl bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700 flex mt-2 justify-center items-center ">
                            <p className="flex-1 space-x-2 text-xl  font-bold font-mono text-white truncate">
                                <span>Author</span>
                                <span className="font-normal text-gray-400 font-mono hover:text-blue-600 ">
                                    <a target="_blank" rel="noopener noreferrer" style={{ display: "table-cell" }} href={`https://ghostnet.tzkt.io/${campaign.author}/operations/`}>{campaign.author?.slice(0,10)+" ... "+campaign.author?.slice(-5)}</a>
                                </span>
                            </p>
                        </div>
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