'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkItem {
    name: string;
    href: string;
    target?: string;
    rel?: string;
    isContactLink?: boolean;
}

const navLinks: NavLinkItem[] = [
    { name: 'Placeholder 1', href: '#' },
    { name: 'Placeholder 2', href: '#' },
    { name: 'Placeholder 3', href: '#' },
    { name: 'Contact', href: '/#contact-section', isContactLink: true },
];

interface NavbarLinksProps {
    className?: string;
    onLinkClick?: () => void;
}

export default function NavbarLinks({ className, onLinkClick }: NavbarLinksProps) {
    const pathname = usePathname();

    const handleLinkClick = (isContactLink?: boolean, event?: React.MouseEvent<HTMLAnchorElement>) => {
        if (onLinkClick) {
            onLinkClick();
        }

        if (isContactLink && pathname === '/') {
            if (event) event.preventDefault();
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <ul className={className}>
            {navLinks.map((link) => (
                <li key={link.name} className="relative group cursor-pointer text-md font-medium text-muted-foreground hover:text-foreground">
                    <Link href={link.href} target={link.target} rel={link.rel} onClick={(e) => handleLinkClick(link.isContactLink, e)} className="no-underline block">
                        {link.name}
                    </Link>
                    <span className="absolute left-0 bottom-[-5px] w-0 h-1 rounded-xl bg-red-400 transition-all duration-300 group-hover:w-full"></span>
                </li>
            ))}
        </ul>
    );
}