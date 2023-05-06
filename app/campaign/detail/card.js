import React from "react";

export default function Card(props) {
    return (

        <div className='max-w-sm py-2 px-4  h-96 w-96  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
            <h1 className='flex flex-row justify-between p-4'> <span className='text-2xl font-bold font-sans text-white'>Amount Raised</span> <span className='text-2xl font-bold font-sans text-white'>{props.fundRaised/1000000} </span></h1>
            <h1 className='flex flex-row justify-between p-4 '> <span className='text-2xl font-bold font-sans text-white'>Amount left</span> <span className='text-2xl font-bold font-sans text-white'>{props.totalFund/1000000} </span></h1>

            <button type="button" class="text-gray-900 flex-row justify-center bg-gray-400 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-7 mt-0.5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2 w-full">
                <svg class="w-4 h-4 mr-2 -ml-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                Contribute Now
            </button>
            <br />
            <div class="flex items-center justify-between p-2">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Customers</h5>
                <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    View all
                </a>
            </div>

            <div class="flow-root ">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    <li class="py-2 sm:py-4 items-center">
                        <div class="flex items-center space-x-2">
                            <div class="flex-shrink-0">
                                <img class="w-8 h-8 rounded-full " src="/7309681.jpg" alt="Neil image" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    Neil Sims
                                </p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                    email@windster.com
                                </p>
                            </div>
                            <div class="inline-flex items-center  text-base font-semibold text-gray-900 dark:text-white">
                                $320
                            </div>
                        </div>
                    </li>


                </ul>
            </div>

        </div>


    )
};