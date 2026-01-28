import React from 'react';
import { LayoutDashboard, Compass, Gavel, PlusCircle, PieChart, Settings, ShoppingBag } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Compass, label: 'Explore' },
        { icon: Gavel, label: 'Auctions' },
        { icon: ShoppingBag, label: 'My Offers' },
        { icon: PlusCircle, label: 'Create NFT' },
        { icon: PieChart, label: 'Analytics' },
    ];

    return (
        <aside className="w-64 border-r border-border-subtle bg-bg-secondary flex flex-col h-screen sticky top-0">
            <div className="h-20 flex items-center px-8 border-b border-border-subtle">
                <h1 className="text-xl font-black tracking-tighter text-gradient flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center text-white">B</div>
                    BASEMARKET
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${item.active
                                ? 'bg-accent-primary/10 text-accent-primary shadow-sm shadow-accent-glow'
                                : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-border-subtle">
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-bg-tertiary hover:text-white transition-all">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
