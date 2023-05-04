'use client'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className=" min-h-screen" >

      <Navbar />
      <Hero />


    </div>
  )
}
