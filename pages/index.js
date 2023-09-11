import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import Center from '@/components/Center';
import { getSession, useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import Player from '@/components/Player';

const inter = Inter({ subsets: ['latin'] })

export default function Home({ session }) {
  console.log(session)
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        <Sidebar/>
        <Center />
      </main>
      <div className='sticky bottom-0'>
        <Player/>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session)
  return {
    props: {
      session
    }
  }
}