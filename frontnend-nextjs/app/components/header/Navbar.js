"use client"
// components/Navbar.js
import { useState } from 'react';
import Link from 'next/link';
import ConnectWallet from '../ConnectWallet';
import { AiOutlineHome } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { PiHandCoinsDuotone } from 'react-icons/pi'
import { HiOutlineBuildingLibrary } from 'react-icons/hi2'


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isWalletConnected, setWalletConnected] = useState(false);

    const handleWalletConnect = (status) => {
        setWalletConnected(status);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4 text-white text-3xl font-bold">
                    <Link href="/">
                        Recyclers DAO
                    </Link>
                </div>
                {/* Mobile menu */}
                <div className="md:hidden">
                    <button
                        className="text-white"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>

                </div>
                {/* Desktop menu */}
                <ul className="hidden md:flex space-x-4 text-white items-center text-lg">
                    <li>
                        <Link href="/" className="flex flex-col items-center">
                            <AiOutlineHome className="text-2xl" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" className="flex flex-col items-center">
                            <CgProfile className="text-2xl" />
                            <span> Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/earn" className="flex flex-col items-center">
                            <PiHandCoinsDuotone className='text-2xl' />
                            <span>Earn</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/Governance" className="flex flex-col items-center">
                            <HiOutlineBuildingLibrary className='text-2xl' />
                            <span> Governance</span>
                        </Link>
                    </li>
                    <li>
                        <ConnectWallet onWalletConnect={handleWalletConnect} />
                    </li>

                </ul>
            </div>
            {isOpen && (
                <div className="mt-2 space-y-2 text-white text-lg flex m-auto flex-col w-full" onClick={toggleMenu}>
                    <Link href="/" className="flex items-center">
                        <AiOutlineHome className="mr-2" /> Home
                    </Link>
                    <Link href="/profile" className="flex items-center">
                        <CgProfile className="text-2xl mr-2" /> Profile
                    </Link>
                    <Link href="/earn" className="flex items-center">
                        <PiHandCoinsDuotone className='text-2xl mr-2' /> Earn
                    </Link>
                    <Link href="/Governance" className="flex items-center">
                        <HiOutlineBuildingLibrary className='text-2xl mr-2' /> Governance
                    </Link>
                    <ConnectWallet onWalletConnect={handleWalletConnect} />
                </div>
            )}
        </nav>
    );
};

export default Navbar;
