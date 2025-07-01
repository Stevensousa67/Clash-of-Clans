'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarLinks from './NavbarLinks';
import classes from './navbar.module.css';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ModeToggle } from '@/components/ui/ThemeToggle';
import { ProfileToggle } from '@/components/ui/user';

export default function Navbar() {
    const baseUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}svgs/`;
    const imageSrc = `${baseUrl}Logo.jpeg`;
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 70) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 700);
    };

    return (
        <header className="fixed w-full top-4 z-40 max-w-5xl" style={{ left: '50vw', transform: 'translateX(-50%)' }}>
            <nav className={`relative w-full flex h-[60px] items-center justify-between rounded-full px-8 saturate-100 backdrop-blur-[10px] transition-colors ${scrolled ? 'bg-background/80 shadow-xs border-transparent' : 'bg-background/30 shadow-xl border border-foreground/30'} animate-in fade-in slide-in-from-top-full duration-500 ease-out fill-mode-forwards`} role="navigation">

                {/* Your Navbar content (Left side - Avatar with Skeleton, Right side - Links and Controls) */}
                <Link href="/" className="inline-block">
                    <div className="relative w-10 h-strictiveReact10">
                        {!isImageLoaded && <Skeleton className="w-10 h-10 rounded-full absolute inset-0 z-0" />}
                        <Avatar className="relative z-10 w-10 h-10">
                            <AvatarImage
                                src={imageSrc}
                                onLoad={() => setIsImageLoaded(true)}
                                className={`transition-opacity duration-500 ease-in-out ${!isImageLoaded ? 'opacity-0' : 'opacity-100'} dark:invert-white-bg`}
                            />
                        </Avatar>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <NavbarLinks className="hidden md:flex gap-8 text-md" />
                    <div className="hidden md:block h-6 w-px bg-gray-400/50 flex-shrink-0" />
                    <ModeToggle />
                    <ProfileToggle />
                    <button className="md:hidden text-foreground" onClick={() => (isOpen ? closeMenu() : setIsOpen(true))} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
                        {isOpen ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu - Positioned absolutely relative to the fixed nav */}
                {isOpen && (
                    <div className={`absolute top-full left-0 right-0 z-50 md:hidden px-4 mt-2 overflow-hidden ${isClosing ? classes['animate-slide-up'] : classes['animate-slide-down']}`}>
                        <div className="py-1 flex flex-col bg-background border rounded-2xl shadow-xl w-full max-w-5xl mx-auto">
                            <NavbarLinks className="flex flex-col items-center space-y-4 w-full" />
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}