"use client"
// components/Navbar.js
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4 text-white text-xl font-bold">
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
                <ul className="hidden md:flex space-x-4 text-white">
                    <li>
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </li>
                    
                </ul>
            </div>
            {isOpen && (
                <div className="mt-2 space-y-2 text-white text-lg flex m-auto flex-col w-full" onClick={toggleMenu}>
                    <Link href="/">
                        Home
                    </Link>
                    <Link href="/dashboard">
                        Dashboard
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
