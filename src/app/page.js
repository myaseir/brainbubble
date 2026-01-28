// app/page.js
import BubbleGame from './components/Bubble';
import Head from 'next/head';

export default function Home() {
  const bubbleNumbers = [2, 4, 7, 11, 15, 3, 8, 12];
  
  return (
    <>
      <Head>
        <title>BrainBuffer</title>
        <meta name="description" content="Interactive number bubble game" />
      </Head>
      
      <main>
        <BubbleGame initialNumbers={bubbleNumbers} />
      </main>
    </>
  );
}