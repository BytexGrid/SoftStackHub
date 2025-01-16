'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const operatingSystems = [
    {
      name: 'Windows',
      description: 'Find software templates for Windows 10 and 11',
      href: '/windows',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg'
    },
    {
      name: 'macOS',
      description: 'Discover tools and apps for your Mac',
      href: '/macos',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/MacOS_logo.svg'
    },
    {
      name: 'Linux',
      description: 'Explore open-source software for Linux distributions',
      href: '/linux',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Icons8_flat_linux.svg'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Full width with contained content */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950 dark:via-gray-900 dark:to-gray-900">
        {/* Static grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801f_1px,transparent_1px),linear-gradient(to_bottom,#8080801f_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-transparent to-purple-100/30 dark:from-indigo-500/20 dark:via-transparent dark:to-purple-500/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,rgba(93,93,255,0.05),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_50%,rgba(93,93,255,0.08),transparent)]"></div>
        </div>

        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-7xl">
                Your Perfect Software Stack
                <span className="relative block mt-6">
                  <span className="absolute -inset-8 blur-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 dark:from-indigo-400/10 dark:via-violet-400/10 dark:to-purple-400/10 rounded-full"></span>
                  <span className="relative bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Awaits Discovery
                  </span>
                </span>
              </h1>
              <p className="mt-10 text-xl leading-8 text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
                Find the best tools and applications for your workflow. Community-curated software templates for every profession and use case.
              </p>
              <div className="mt-12 flex items-center justify-center gap-x-8">
                <motion.a 
                  href="#explore" 
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-indigo-400 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-white/20 to-indigo-400/0"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Get Started
                </motion.a>
                <motion.a 
                  href="#how-it-works" 
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white flex items-center gap-1"
                  whileHover={{ x: 5 }}
                >
                  Learn more 
                  <motion.span 
                    aria-hidden="true"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OS Selection Section */}
      <section id="explore" className="w-full py-24 bg-white dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
                Choose Your Platform
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Select your operating system to discover curated software templates tailored to your needs
              </p>
            </div>

            {/* OS Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {operatingSystems.map((os) => (
                <Link
                  key={os.name}
                  href={os.href}
                  className="group relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/0 via-transparent to-purple-100/0 dark:from-indigo-500/5 dark:via-transparent dark:to-purple-500/5 rounded-2xl transition-opacity group-hover:opacity-100 opacity-0"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-6 flex items-center justify-center">
                      <Image
                        src={os.icon}
                        alt={os.name}
                        width={64}
                        height={64}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {os.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {os.description}
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Browse templates
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="w-full py-24 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
                How Templates Work
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover and select the perfect software combinations for your needs
              </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              {/* Light theme preview */}
              <div className="block dark:hidden">
                <Image
                  src="/preview_template/light_preview.png"
                  alt="Template preview in light mode"
                  width={1200}
                  height={800}
                  className="rounded-2xl shadow-lg"
                  priority
                />
              </div>
              
              {/* Dark theme preview */}
              <div className="hidden dark:block">
                <Image
                  src="/preview_template/dark_preview.png"
                  alt="Template preview in dark mode"
                  width={1200}
                  height={800}
                  className="rounded-2xl shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="w-full py-24 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get started with your perfect software stack in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  number: '01',
                  title: 'Choose OS',
                  description: 'Select your operating system to get personalized software recommendations tailored to your platform.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  )
                },
                {
                  number: '02',
                  title: 'Pick Template',
                  description: 'Browse through our community-curated collection of software templates designed for different workflows.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )
                },
                {
                  number: '03',
                  title: 'Install & Enjoy',
                  description: 'One-click installation of all recommended software. Get your perfect setup ready in minutes.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((step) => (
                <div key={step.title} className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  <div className="mb-6 text-indigo-600 dark:text-indigo-400">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Walkthrough Section */}
      <section className="w-full py-24 bg-white dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
                Why SoftStacker?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover how SoftStacker revolutionizes your software setup experience
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Community-Driven Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-sm">
                <div className="text-indigo-600 dark:text-indigo-400 mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Community-Driven Templates</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Benefit from the collective wisdom of experienced developers and professionals. Our templates are created and voted on by the community, helping you discover the best software for your needs.
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Community-voted software suggestions
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-world tested combinations
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Transparent voting system
                  </li>
                </ul>
              </div>

              {/* Time-Saving Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-sm">
                <div className="text-indigo-600 dark:text-indigo-400 mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Save Time and Effort</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Skip the tedious process of researching software combinations. With SoftStacker, discover community-recommended software setups instantly.
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quick software discovery
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Curated software lists
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed software information
                  </li>
                </ul>
              </div>

              {/* Professional Templates Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-sm">
                <div className="text-indigo-600 dark:text-indigo-400 mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Professional Templates</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Find software collections for every profession and workflow. Whether you&apos;re a developer, designer, or content creator, discover tools that match your needs.
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Profession-specific suggestions
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Popular software combinations
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Workflow-based recommendations
                  </li>
                </ul>
              </div>

              {/* Cross-Platform Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-sm">
                <div className="text-indigo-600 dark:text-indigo-400 mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cross-Platform Support</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Find the right software no matter which operating system you use. SoftStacker provides tailored suggestions for Windows, macOS, and Linux users.
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Platform-specific suggestions
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Alternative software options
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Easily select package when submitting a new template
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Project Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">SoftStacker</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                Discover the perfect software stack for your workflow. Community-driven software recommendations for every platform and profession.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/BytexGrid/SoftStacker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/BytexGrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/windows" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Windows
                  </Link>
                </li>
                <li>
                  <Link href="/macos" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    macOS
                  </Link>
                </li>
                <li>
                  <Link href="/linux" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Linux
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/submit" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Submit Template
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Browse Templates
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/BytexGrid/SoftStacker/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Report Issue
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} SoftStacker. Built by the community, for the community. Open source with ❤️
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
