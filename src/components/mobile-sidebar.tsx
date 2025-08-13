'use client';

import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Sidebar } from './sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathName]);

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant={'secondary'} className="lg:hidden">
                    <MenuIcon className="size-4 text-neutral-500" />
                </Button>
                <SheetContent side="left" className="p-0">
                    <Sidebar />
                </SheetContent>
            </SheetTrigger>
        </Sheet>
    );
};
