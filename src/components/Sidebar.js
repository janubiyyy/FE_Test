import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoJasa from '../assets/logo-jasaa.jpeg';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);  // State untuk mengontrol apakah sidebar terbuka atau tidak
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Gerbang Master', path: '/gerbang' },
        { name: 'Lalin Report', path: '/lalin' },
    ];

    return (
        <div className={`h-screen bg-[#244786] text-white w-64 fixed transition-all duration-300 
            ${isOpen ? 'w-64' : 'w-11'} md:w-64`} >  {/* Ubah lebar sidebar saat ditutup */}
            <div className="p-4 flex items-center justify-between">
                {/* Logo */}
                {isOpen && (
                    <img
                        src={LogoJasa}
                        alt="Logo Jasa"
                        className="mt-2 mx-auto w-70 h-auto"
                        style={{ borderRadius: '8px' }}
                    />
                )}
                {/* Ikon hamburger untuk mobile */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '☰' : '☰'} {/* Tanda panah untuk membuka dan menutup */}
                </button>
            </div>
            {/* Menu Items */}
            <ul className={`mt-6 ${isOpen ? 'block' : 'hidden'}`}>  {/* Menyembunyikan menu item saat sidebar ditutup */}
                {menuItems.map((item) => (
                    <li key={item.name} className="font-bold mb-4 text-white">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg ${isActive ? 'bg-[#B3CEFF] text-black' : 'hover:bg-[#B3CEFF]text-black'}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
