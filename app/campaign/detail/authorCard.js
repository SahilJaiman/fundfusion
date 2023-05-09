import React from 'react'
import { Button,Tooltip } from 'antd'


export default function AuthorCard({author}) {
    return (
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
                <Button size='large' className='bg-blue-600' block type="primary">Withdraw</Button>
            </div>

        </div>

    )
}
