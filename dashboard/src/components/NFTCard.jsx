import React from 'react';
import { ShoppingCart, Heart, ExternalLink } from 'lucide-react';

const NFTCard = ({ nft }) => {
    return (
        <div className="bg-bg-secondary border border-border-subtle rounded-3xl overflow-hidden group hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-2xl">
            <div className="aspect-square bg-bg-tertiary relative overflow-hidden">
                {/* Shimmer Placeholder / Actual Image */}
                <div className="w-full h-full bg-gradient-to-br from-bg-tertiary to-bg-secondary group-hover:scale-110 transition-transform duration-700"></div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-white/10">
                        {nft.tag || 'Digital Art'}
                    </span>
                </div>

                <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 transition-colors">
                    <Heart size={14} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <button className="w-full bg-accent-primary text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ShoppingCart size={16} /> Quick Buy
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h5 className="text-white font-bold text-lg leading-tight group-hover:text-accent-primary transition-colors">{nft.name}</h5>
                        <p className="text-[10px] text-text-tertiary font-mono mt-1 uppercase tracking-widest">Token #{nft.tokenId}</p>
                    </div>
                    <ExternalLink size={16} className="text-text-tertiary hover:text-white transition-colors" />
                </div>

                <div className="flex justify-between items-end mt-6">
                    <div>
                        <p className="text-[10px] text-text-tertiary font-black uppercase">Current Price</p>
                        <p className="text-xl font-black text-white">{nft.price} ETH</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-text-tertiary font-black uppercase">Listed by</p>
                        <p className="text-xs font-bold text-accent-primary font-mono">{nft.seller.substring(0, 6)}...{nft.seller.substring(38)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTCard;
