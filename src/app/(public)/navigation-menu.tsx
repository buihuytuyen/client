'use client';

import Link from 'next/link';

import { Menu, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import NavItems from '@/app/(public)/nav-items';
export default function NavigationMenu() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleNavItemClick = () => {
    setIsSheetOpen(false);
  };
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetTitle>
        <SheetDescription />
      </SheetTitle>
      <SheetContent side='left'>
        <nav className='grid gap-6 text-lg font-medium'>
          <SheetClose asChild>
            <Link href='/' className='flex items-center gap-2 text-lg font-semibold'>
              <Package2 className='h-6 w-6' />
              <span className='sr-only'>Big boy</span>
            </Link>
          </SheetClose>

          <NavItems
            className='text-muted-foreground transition-colors hover:text-foreground'
            handleNavItemClick={handleNavItemClick}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
