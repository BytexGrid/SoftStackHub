'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TemplatesLanding() {
  const osOptions = [
    {
      name: 'Windows',
      path: '/windows',
      description: 'Software templates for Windows machines',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg'
    },
    {
      name: 'macOS',
      path: '/macos',
      description: 'Software templates for Mac computers',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/MacOS_logo.svg'
    },
    {
      name: 'Linux',
      path: '/linux',
      description: 'Software templates for Linux distributions',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Icons8_flat_linux.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Templates
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Choose your operating system to find the perfect software setup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {osOptions.map(os => (
            <Link
              key={os.name}
              href={os.path}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center mx-auto">
                    <Image
                      src={os.icon}
                      alt={os.name}
                      width={48}
                      height={48}
                      className="transition-transform group-hover:scale-110"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {os.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {os.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 