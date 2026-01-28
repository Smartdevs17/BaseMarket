import React from 'react';
import { Search, Wallet, Bell } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-20 border-b border-border-subtle flex items-center justify-between px-8 glass-morphism sticky top-0 z-50">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <input
                        type="text"
                        placeholder="Search NFTs, Collections, or Sellers..."
                        className="w-full bg-bg-secondary border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-primary rounded-full"></span>
                </button>

                <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-glow">
                    <Wallet size={18} />
                    <span>Connect Wallet</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
