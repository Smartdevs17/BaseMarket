import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NFTCard from './components/NFTCard';
import AuctionItem from './components/AuctionItem';

const MOCK_NFTS = [
  { id: 1, tokenId: '1024', name: 'Ethereal Fragment #1', price: '0.25', seller: '0x1234...5678', tag: '3D Art' },
  { id: 2, tokenId: '1025', name: 'Digital Genesis #8', price: '0.42', seller: '0x8888...9999', tag: 'Abstract' },
  { id: 3, tokenId: '1026', name: 'Base Pixel #12', price: '0.15', seller: '0xAAAA...BBBB', tag: 'Pixel' },
  { id: 4, tokenId: '1027', name: 'Sonic Wave #44', price: '0.88', seller: '0xCCCC...DDDD', tag: 'Motion' },
];

const MOCK_AUCTIONS = [
  { id: 1, name: 'Abstract #101', timeLeft: '2h 45m', currentBid: '0.42' },
  { id: 2, name: 'Abstract #102', timeLeft: '1h 12m', currentBid: '1.15' },
  { id: 3, name: 'Abstract #103', timeLeft: '14m 30s', currentBid: '0.89' },
];

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="main-content">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight">Marketplace Overview</h2>
                <p className="text-text-secondary mt-2">Track your listings, offers, and digital assets on Base.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-bg-secondary border border-border-subtle p-4 rounded-2xl flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Total Volume</span>
                  <span className="text-xl font-black text-white">124.5 ETH</span>
                </div>
                <div className="bg-bg-secondary border border-border-subtle p-4 rounded-2xl flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Floor Price</span>
                  <span className="text-xl font-black text-white">0.08 ETH</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-[450px] bg-gradient-to-br from-accent-primary/20 to-bg-secondary border border-border-subtle rounded-3xl p-8 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <span className="bg-accent-primary/20 text-accent-primary text-[10px] font-black uppercase px-2 py-1 rounded">Featured Collection</span>
                    <h3 className="text-5xl font-black text-white mt-4 leading-tight">Base Punks <br />Genesis Drop</h3>
                  </div>
                  <button className="w-fit bg-white text-bg-primary px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-white/10">
                    Explore Drop
                  </button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent-primary/20 rounded-full blur-[100px] group-hover:bg-accent-primary/30 transition-all"></div>
              </div>

              <div className="bg-bg-secondary border border-border-subtle rounded-3xl p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <h4 className="text-white font-bold text-lg mb-2 tracking-tight">Active Auctions</h4>
                  <p className="text-text-secondary text-sm">Real-time bidding on top-tier assets.</p>
                </div>
                <div className="space-y-3 mt-8">
                  {MOCK_AUCTIONS.map((auction) => (
                    <AuctionItem key={auction.id} auction={auction} />
                  ))}
                </div>
                <button className="w-full mt-6 text-xs font-bold text-text-tertiary hover:text-white transition-colors underline underline-offset-4">
                  View All Auctions
                </button>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="text-white font-black text-2xl mb-8 tracking-tight">Explore Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {MOCK_NFTS.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
