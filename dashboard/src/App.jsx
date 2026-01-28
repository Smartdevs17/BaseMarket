import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="main-content">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
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
              <div className="md:col-span-2 h-[400px] bg-gradient-to-br from-accent-primary/20 to-bg-secondary border border-border-subtle rounded-3xl p-8 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <span className="bg-accent-primary/20 text-accent-primary text-[10px] font-black uppercase px-2 py-1 rounded">Featured Collection</span>
                    <h3 className="text-5xl font-black text-white mt-4 leading-tight">Base Punks <br />Genesis Drop</h3>
                  </div>
                  <button className="w-fit bg-white text-bg-primary px-8 py-3 rounded-xl font-black hover:scale-105 transition-all shadow-xl shadow-white/10">
                    Explore Drop
                  </button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent-primary/20 rounded-full blur-[100px] group-hover:bg-accent-primary/30 transition-all"></div>
              </div>

              <div className="bg-bg-secondary border border-border-subtle rounded-3xl p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Active Auctions</h4>
                  <p className="text-text-secondary text-sm">Real-time bidding on top-tier digital collectibles.</p>
                </div>
                <div className="space-y-4 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bg-tertiary/50 border border-border-subtle rounded-xl">
                      <div className="w-10 h-10 bg-bg-tertiary rounded-lg"></div>
                      <div className="flex-1 ml-3">
                        <p className="text-xs font-bold text-white uppercase">Abstract #{100 + i}</p>
                        <p className="text-[10px] text-text-tertiary font-mono">2h 45m left</p>
                      </div>
                      <span className="text-xs font-black text-accent-primary">0.42 ETH</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 text-xs font-bold text-text-tertiary hover:text-white transition-colors underline">
                  View All Auctions
                </button>
              </div>
            </div>

            {/* Placeholder for NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden group hover:border-accent-primary/50 transition-all cursor-pointer">
                  <div className="aspect-square bg-bg-tertiary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-text-tertiary uppercase">Digital Art</p>
                    <h5 className="text-white font-bold mt-1">Ethereal Fragment #{i}</h5>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border-subtle">
                      <span className="text-sm font-black text-white">0.25 ETH</span>
                      <button className="text-[10px] font-black uppercase bg-accent-primary/10 text-accent-primary px-3 py-1 rounded-lg">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
