import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

type PackageInfo = {
  name: string;
  description: string;
  version?: string;
  downloads?: number;
  website?: string;
  aptPackage?: string;
  dnfPackage?: string;
  pacmanPackage?: string;
};

type Props = {
  searchTerm: string;
  targetOS: 'windows' | 'macos' | 'linux';
  onSelect: (packageInfo: PackageInfo) => void;
};

type LinuxPackageManager = 'apt' | 'dnf' | 'pacman';

export default function PackageSuggestions({ searchTerm, targetOS, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<PackageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [selectedPkgManager, setSelectedPkgManager] = useState<LinuxPackageManager>('apt');

  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setError(null);
      setIsOpen(true);

      try {
        const url = new URL('./api/packages/search', window.location.href);
        url.searchParams.set('q', debouncedSearch);
        url.searchParams.set('os', targetOS);
        if (targetOS === 'linux') {
          url.searchParams.set('pkgManager', selectedPkgManager);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const data = await response.json();
        
        let transformedData: PackageInfo[] = [];
        
        if (targetOS === 'windows') {
          const results = data.d?.results || data.value || [];
          transformedData = results.map((item: any) => ({
            name: item.Title || item.Id,
            description: item.Description?.split(/[.!?](?:\s|$)/)[0] || '',
            version: item.Version,
            downloads: item.DownloadCount,
            website: item.ProjectUrl
          }));
        } else if (targetOS === 'macos') {
          transformedData = data.map((item: any) => ({
            name: item.name,
            description: item.desc?.split(/[.!?](?:\s|$)/)[0] || '',
            version: item.versions?.stable,
            website: item.homepage,
            brewPackage: item.name,
            fullName: item.full_name,
            tap: item.tap
          }));
        } else if (targetOS === 'linux') {
          switch (selectedPkgManager) {
            case 'apt':
              const entries = data.entries || [];
              transformedData = entries.slice(0, 10).map((item: any) => ({
                name: item.source_package_name,
                description: item.source_package_version,
                version: item.source_package_version,
                website: `https://packages.ubuntu.com/search?keywords=${item.source_package_name}`,
                aptPackage: item.source_package_name
              }));
              break;
            case 'dnf':
              transformedData = data.rows?.slice(0, 10).map((item: any) => ({
                name: item.name,
                description: item.summary,
                version: item.version,
                website: `https://packages.fedoraproject.org/pkgs/${item.name}`,
                dnfPackage: item.name
              })) || [];
              break;
            case 'pacman':
              transformedData = data.results?.slice(0, 10).map((item: any) => ({
                name: item.Name,
                description: item.Description,
                version: item.Version,
                website: item.URL,
                pacmanPackage: item.Name
              })) || [];
              break;
          }
        }

        setSuggestions(transformedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [debouncedSearch, targetOS, selectedPkgManager]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest('.suggestions-container')) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (pkg: PackageInfo) => {
    onSelect(pkg);
    setIsOpen(false);
  };

  if (!searchTerm || searchTerm.length < 2 || !isOpen) return null;

  return (
    <div className="suggestions-container absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 max-h-[calc(100vh-200px)] overflow-auto">
      {targetOS === 'linux' && (
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-2 flex gap-2">
          {(['apt', 'dnf', 'pacman'] as LinuxPackageManager[]).map((pm) => (
            <button
              key={pm}
              onClick={() => setSelectedPkgManager(pm)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedPkgManager === pm
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {pm.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        {loading && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading suggestions...
          </div>
        )}
        
        {error && (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        )}
        
        {!loading && !error && suggestions.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No packages found
          </div>
        )}
        
        {!loading && !error && suggestions.map((pkg) => (
          <button
            key={pkg.name}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(pkg);
            }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {pkg.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {pkg.description}
                </p>
              </div>
              <div className="text-right text-sm">
                {pkg.version && (
                  <span className="text-gray-500 dark:text-gray-400">
                    v{pkg.version}
                  </span>
                )}
                {pkg.downloads && (
                  <div className="text-gray-400 dark:text-gray-500">
                    {new Intl.NumberFormat().format(pkg.downloads)} downloads
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 