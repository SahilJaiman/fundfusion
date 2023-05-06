import React from 'react'
import { useRouter } from 'next/navigation';

export default function CampaignCard({ campaign }) {
    const router = useRouter();
    const onHandleClick = (id) => {
        router.push(`campaign/detail?id=${id}`)
    }

    return (

        <div onClick={() => onHandleClick(campaign.value.id)} class="max-w-sm p-6 h-full hover:scale-[1.01] transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700">
            <div className='flex flex-col  items-center'>
                {/* Cover Image */}
                <div className='h-40 w-80  overflow-hidden relative rounded-xl group'>
                    <img className="absolute w-full h-full transition-transform ring-4  duration-300 transform group-hover:scale-110  object-cover" src={campaign.value.thumbnail_url} alt="" />
                </div>
            </div>
            <div class="p-2 ">
                {/* Title */}
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{campaign.value.title}</h5>
                </a>
                {/* Content */}
                <p class="mb-4 font-normal max-h-24 text-gray-700 dark:text-gray-400 overflow-hidden">{campaign.value.desc}</p>

                {/* remaining amount */}
                <div className='flex  flex-col justify-center items-center w-full h-full '>
                    {/* Donated amount */}
                    <div href="#" className="w-full h-full mb-3  bg-green-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-between px-4 py-2.5 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-gray-700">



                        <div className="text-left ml-2 gap-4 flex flex-row items-center justify-between">
                            <img class=" w-7 h-7" src='/gift.png' alt='/'></img>
                            <div class=" text-m">Donated Amount</div>

                        </div>
                        <div class=" font-sans text-m font-semibold text-right">{campaign.value.fundraised}</div>
                    </div>
                    {/* Needed amount */}
                    <div href="#" class="w-full h-full mb-3  bg-red-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-between px-4 py-2.5 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-gray-700">

                        <div class="text-left ml-2 gap-4 flex flex-row justify-between ">
                            <img class=" w-7 h-7" src='/hand.png' alt='/'></img>
                            <span class=" text-m">Amount Needed</span>

                        </div>
                        <div class=" font-sans text-m font-semibold text-right">
                            <span>
                                {campaign.value.fundraising_goal / 1000000}
                                <img className='inline w-4 h-4 ml-1' src='/tezos.svg' />
                            </span>
                        </div>
                    </div>
                </div>
                {/* Contribute Button */}
                <div className='flex flex-row justify-center md:justify-end'>
                    <a href="#" class="inline-flex items-center justify-center text-center mt-2 px-2 py-2 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                        I want to Contribute  ❤️
                    </a>
                </div>
            </div>

        </div>

    )
}