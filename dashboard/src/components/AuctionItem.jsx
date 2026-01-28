import React from 'react';
import { Timer } from 'lucide-react';

const AuctionItem = ({ auction }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 border border-border-subtle rounded-2xl hover:bg-bg-tertiary/50 hover:border-accent-primary/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-bg-tertiary rounded-xl overflow-hidden relative border border-white/5">
                <div className="w-full h-full bg-gradient-to-br from-accent-primary/20 to-bg-secondary group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            <div className="flex-1 ml-4">
                <p className="text-xs font-black text-white uppercase tracking-tight group-hover:text-accent-primary transition-colors">
                    {auction.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    <Timer size={10} className="text-text-tertiary" />
                    <p className="text-[10px] text-text-tertiary font-mono uppercase font-bold">
                        {auction.timeLeft} left
                    </p>
                </div>
            </div>

            <div className="text-right">
                <p className="text-[10px] text-text-tertiary font-black uppercase mb-0.5">High Bid</p>
                <span className="text-sm font-black text-white tabular-nums">
                    {auction.currentBid} ETH
                </span>
            </div>
        </div>
    );
};

export default AuctionItem;
