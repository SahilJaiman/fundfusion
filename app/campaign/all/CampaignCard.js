import React from 'react'
import { useRouter } from 'next/navigation';
import { Rate, ConfigProvider, theme } from 'antd';

export default function CampaignCard({ campaign }) {
    const router = useRouter();
    const onHandleClick = (id) => {
        router.push(`campaign/detail?id=${id}`)
    }
    const calculateBarPercentage = (goal, raisedAmount) => {
        const percentage = Math.round((raisedAmount * 100) / goal);
        console.log("%", percentage);
        return percentage;
    };


    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >

            <div class="max-w-sm gap-4 p-4 flex flex-col h-full hover:scale-[1.01] transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700">
                <div className='flex flex-col  items-center'>
                    {/* Cover Image */}
                    <div onClick={() => onHandleClick(campaign.value.id)} className='h-40 w-full  overflow-hidden relative rounded-xl group'>
                        <img className="absolute w-full h-full transition-transform ring-4  duration-300 transform group-hover:scale-110  object-cover" src={campaign.value.thumbnail_url} alt="" />
                    </div>
                </div>
                <div class="flex h-full flex-col justify-between p-2 ">
                    {/* Title */}
                    <div className='space-y-2'>
                        <div >
                            <h5 class=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{campaign.value.title}</h5>
                        </div>
                        {/* Content */}
                        <p class="font-normal max-h-24 text-gray-700 dark:text-gray-400 overflow-hidden">{campaign.value.desc}</p>
                    </div>
                    {/* remaining amount */}
                    <div className='mt-2'>
                        <div class="flex flex-col items-start justify-center ">
                            <div class="font-mono flex space-x-2 text-white text-2xl font-extrabold text-center"><span>{Math.round(campaign.value.fundraised / 1000000)}</span> <img src='/tezos.svg' className='w-[30px] h-[30px] ' /></div>
                            <div class="text-gray-500 dark:text-gray-400 font-mono">Raised of {campaign.value.fundraising_goal / 1000000}</div>

                        </div>
                        <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
                            <div className="absolute h-full  bg-blue-500" style={{ width: `${calculateBarPercentage(campaign.value.fundraising_goal, campaign.value.fundraised)}%`, maxWidth: '100%' }}>
                            </div>
                        </div>
                        {/* Creator details */}
                        <div className=" flex mt-2 justify-center items-center ">
                            <p className="flex-1 font-sans font-bold text-md text-[#808191] truncate">
                                by <span className="font-normal hover:text-blue-600 text-[#b2b3bd] text-xs">
                                    <a target="_blank" rel="noopener noreferrer" style={{ display: "table-cell" }} href={`https://ghostnet.tzkt.io/${campaign.value.author}/operations/`}>{campaign.value.author}</a>
                                </span>
                            </p>
                        </div>
                        {/* Contribute Button */}
                        <div className='flex flex-row justify-center md:justify-end  '>
                            <a onClick={() => onHandleClick(campaign.value.id)} class="inline-flex group  items-center justify-center text-center mt-2 px-2 py-2 font-medium rounded-full text-sm p-2 dark:border-blue-500 dark:text-white dark:hover:text-blue-600 ">
                                I want to Contribute  <span className='group-hover:animate-spin group-hover:ml-1 group-hover:scale-[1.4] inline-flex duration-300 ease-in-out'>❤️</span>
                            </a>
                        </div>

                        <div className='flex justify-center w-full '>
                            <Rate allowHalf />
                        </div>

                    </div>
                </div>

            </div>
        </ConfigProvider>

    )
}