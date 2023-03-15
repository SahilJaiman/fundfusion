'use client';
import React from 'react'
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation'


export default function Hero() {

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center mx-auto p-6 md:p-12 lg:flex-row bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="flex flex-col p-6 space-y-10  lg:w-1/2 ">
        <h1
          className="text-4xl font-bold text-center md:text-6xl lg:max-w-xl lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-rose-100 to-teal-100 "
        >
          <span className=" antialiased text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800">FundFusion</span>
          <br />
          One Platform, Endless Possibilities

        </h1>
        <p
          className="text-2xl text-center text-white  lg:max-w-lg lg:text-left"
        >
          From Ideas to Impact - Connect with a Diverse Community of Investors and Donors
        </p>
        <div className="mx-auto space-x-4 lg:mx-0">
          <Button onClick={()=>router.push('/campaign/new')} className='ring-2' type="primary" shape="round" >Get Started</Button>
          <Button  className='ring-2' type="primary" shape="round" >Learn More</Button>


        </div>
      </div>


      <div className="h-full " >

        <Image
          src="/hero.svg"
          width="500"
          height="500"
          alt="Hero Illustration"

          loading="eager"

        />

      </div>



    </div>
  )
}
