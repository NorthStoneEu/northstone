'use client'

import { useState } from 'react'
import Link from 'next/link'

const mobileLinks = [
  { label: 'Drops', href: '#drop-01' },
  { label: 'Authenticité', href: '/verify' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Connexion', href: '/login' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black border-b border-zinc-900 flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-bold tracking-widest uppercase text-sm text-white"
        >
          Northstone
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#drop-01" className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors">
            Drop 01
          </Link>
          <Link href="/verify" className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors">
            Authenticité
          </Link>
          <Link href="/about" className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors">
            À propos
          </Link>
          <Link
            href="/login"
            className="text-xs tracking-[0.2em] uppercase border border-zinc-700 px-4 py-2 text-zinc-400 hover:border-white hover:text-white transition-colors"
          >
            Connexion
          </Link>
        </nav>

        {/* Burger button — mobile only */}
        <button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[6px]"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-10 md:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-2xl font-bold tracking-[0.2em] uppercase text-white hover:text-zinc-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}
