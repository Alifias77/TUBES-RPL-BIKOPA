'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const busWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = busWrapperRef.current;
    if (!el) return;

    function triggerEnter() {
      if (!el) return;
      el.classList.remove('animate-bus-arrive');
      void el.offsetWidth;
      el.classList.add('animate-bus-arrive');
    }

    // Trigger on initial page load / open
    triggerEnter();

    // Re-trigger when scrolling back to beranda
    const berandaEl = document.getElementById('beranda');
    let observer: IntersectionObserver | null = null;
    let wasAway = false;

    if (berandaEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && wasAway) {
              triggerEnter();
              wasAway = false;
            } else if (!entry.isIntersecting) {
              wasAway = true;
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(berandaEl);
    }

    const handleAnchorClick = () => {
      setTimeout(triggerEnter, 80);
    };

    const berandaLinks = document.querySelectorAll('a[href="#beranda"]');
    berandaLinks.forEach((link) => {
      link.addEventListener('click', handleAnchorClick);
    });

    return () => {
      if (observer && berandaEl) observer.unobserve(berandaEl);
      berandaLinks.forEach((link) => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <div className="relative font-nav w-full flex-1 flex flex-col justify-between md:flex-row md:items-center overflow-hidden">
      {/* 1. Text Elements Container (Positioned on top on mobile, left on desktop) */}
      <div className="wrap gutter relative z-10 flex flex-col justify-start md:justify-center w-full pt-4 pb-2 sm:pt-6 md:py-16 md:min-h-[calc(100svh-64px)]">
        <div className="max-w-[540px] w-full">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs ring-1 ring-white/20 text-white"
            role="status"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span id="pill-text">
              Beroperasi Setiap Hari · 06:00–21:00 WITA
            </span>
          </div>

          <h1 className="mt-4 sm:mt-5 text-3xl font-bold leading-[1.15] sm:text-4xl md:text-5xl lg:text-[3.5rem] text-white break-words">
            Rute, halte, dan jadwal<br />Bus Trans Palu
          </h1>

          <p className="mt-3 sm:mt-4 md:mt-5 max-w-md text-sm sm:text-base leading-relaxed text-white/90">
            Lihat jalur lima koridor, titik halte terdekat, jadwal operasional, dan titik transfer resmi. Tanpa daftar, tanpa login.
          </p>

          <a
            href="#armada"
            className="mt-5 sm:mt-6 md:mt-8 inline-flex min-h-[46px] sm:min-h-[48px] items-center bg-sky px-6 sm:px-8 text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-white hover:brightness-110 focus-ring shadow-lg transition-all"
          >
            Lihat Rute
          </a>
        </div>
      </div>

      {/* 2. Hero Image: Isolated Bus (Placed at the bottom on mobile, enlarged & shifted left; right-aligned on desktop) */}
      <div className="relative w-full z-0 flex items-end justify-start mt-auto pb-4 sm:pb-6 md:pb-0 md:mt-0 md:absolute md:inset-y-0 md:left-auto md:right-0 md:w-[60%] lg:w-[58%] xl:w-[55%] md:h-full md:flex md:items-center md:justify-end md:pr-2 lg:pr-4 pointer-events-none overflow-visible md:overflow-hidden">
        <div className="relative w-[130%] min-w-[380px] max-w-[580px] sm:w-[120%] sm:max-w-[640px] md:w-full md:max-w-[640px] lg:max-w-[760px] flex flex-col items-center justify-center -translate-x-7 sm:-translate-x-5 md:translate-x-8 lg:translate-x-12 -translate-y-10 sm:-translate-y-12 md:translate-y-0">
          <div
            ref={busWrapperRef}
            id="hero-bus-wrapper"
            className="hero-bus-wrapper relative w-full flex flex-col items-center justify-center animate-bus-arrive"
          >
            {/* Ambient Ground Contact Shadow */}
            <div className="hero-bus-shadow absolute -bottom-2 sm:-bottom-3 md:-bottom-5 left-1/2 -translate-x-1/2 w-[85%] h-6 sm:h-10 md:h-14 bg-black/50 rounded-full blur-xl pointer-events-none" />

            {/* Bus Cutout Image */}
            <Image
              src="/images/bus-trans-palu-nobg.png"
              alt="Bus Trans Palu tampak depan melaju tanpa latar belakang"
              priority
              width={1200}
              height={800}
              className="hero-bus-img relative z-10 block w-full h-auto max-h-[48vh] sm:max-h-[54vh] md:max-h-[82vh] object-contain opacity-100 transition-opacity duration-300 drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
