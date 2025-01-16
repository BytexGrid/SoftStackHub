import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const os = searchParams.get('os');

  if (!query || !os) {
    return NextResponse.json({ error: 'Missing query or OS parameter' }, { status: 400 });
  }

  try {
    let url = '';
    switch (os) {
      case 'windows':
        url = `https://community.chocolatey.org/api/v2/Search()?$filter=IsLatestVersion&$skip=0&$top=10&searchTerm='${query}'&targetFramework=''&includePrerelease=false`;
        break;
      case 'macos':
        // Fetch all formulae and filter on the server side
        url = 'https://formulae.brew.sh/api/formula.json';
        const brewResponse = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SoftStacker/1.0'
          }
        });
        
        if (!brewResponse.ok) {
          throw new Error(`Failed to fetch Homebrew data: ${brewResponse.status} ${brewResponse.statusText}`);
        }

        const brewData = await brewResponse.json();
        
        // Score and sort results by relevance
        interface ScoredFormula {
          formula: any;
          score: number;
        }

        const scoredResults = brewData
          .map((formula: any) => {
            const nameLower = formula.name.toLowerCase();
            const queryLower = query.toLowerCase();
            let score = 0;
            
            // Exact match gets highest score
            if (nameLower === queryLower) {
              score += 100;
            }
            // Starts with query gets high score
            else if (nameLower.startsWith(queryLower)) {
              score += 50;
            }
            // Contains query in name gets medium score
            else if (nameLower.includes(queryLower)) {
              score += 25;
            }
            // Contains query in description gets low score
            else if (formula.desc?.toLowerCase().includes(queryLower)) {
              score += 10;
            }
            
            return { formula, score };
          })
          .filter((item: ScoredFormula) => item.score > 0) // Only keep matches
          .sort((a: ScoredFormula, b: ScoredFormula) => b.score - a.score) // Sort by score descending
          .slice(0, 10) // Take top 10
          .map((item: ScoredFormula) => item.formula); // Extract formula data

        return NextResponse.json(scoredResults);

      case 'linux':
        const pkgManager = searchParams.get('pkgManager') || 'apt';
        let transformedData = [];
        
        try {
          switch (pkgManager) {
            case 'apt':
              // Using Debian packages API
              url = `https://sources.debian.org/api/search/${encodeURIComponent(query)}/`;
              const aptResponse = await fetch(url);
              
              if (!aptResponse.ok) {
                throw new Error(`Failed to fetch APT data: ${aptResponse.status}`);
              }
              
              const aptData = await aptResponse.json();
              transformedData = (aptData.results?.exact || aptData.results?.substring || [])
                .map((pkg: any) => ({
                  name: pkg.name,
                  description: pkg.description?.split(/[.!?](?:\s|$)/)[0] || pkg.name,
                  version: 'latest',
                  website: `https://packages.debian.org/stable/${pkg.name}`,
                  aptPackage: pkg.name
                }))
                .slice(0, 10);
              break;

            case 'dnf':
              // Using Fedora packages API
              url = `https://pkgs.org/api/packages/?q=${encodeURIComponent(query)}&distribution=fedora`;
              const dnfResponse = await fetch(url);
              
              if (!dnfResponse.ok) {
                throw new Error(`Failed to fetch DNF data: ${dnfResponse.status}`);
              }
              
              const dnfData = await dnfResponse.json();
              transformedData = (dnfData.results || [])
                .map((pkg: any) => ({
                  name: pkg.name,
                  description: pkg.description?.split(/[.!?](?:\s|$)/)[0] || pkg.name,
                  version: pkg.version || 'latest',
                  website: `https://packages.fedoraproject.org/pkgs/${pkg.name}`,
                  dnfPackage: pkg.name
                }))
                .slice(0, 10);
              break;

            case 'pacman':
              // Using AUR RPC interface
              url = `https://aur.archlinux.org/rpc/v5/search/${encodeURIComponent(query)}`;
              const pacmanResponse = await fetch(url);
              
              if (!pacmanResponse.ok) {
                throw new Error(`Failed to fetch Pacman data: ${pacmanResponse.status}`);
              }
              
              const pacmanData = await pacmanResponse.json();
              if (pacmanData.type === 'error') {
                throw new Error(`AUR error: ${pacmanData.error}`);
              }
              
              transformedData = (pacmanData.results || [])
                .map((pkg: any) => ({
                  name: pkg.Name,
                  description: pkg.Description?.split(/[.!?](?:\s|$)/)[0] || pkg.Name,
                  version: pkg.Version,
                  website: pkg.URL || `https://aur.archlinux.org/packages/${pkg.Name}`,
                  pacmanPackage: pkg.Name
                }))
                .slice(0, 10);
              break;

            default:
              throw new Error('Unsupported package manager');
          }

          if (transformedData.length === 0) {
            console.log(`No packages found for ${pkgManager} with query: ${query}`);
          } else {
            console.log(`${pkgManager.toUpperCase()} search results:`, transformedData.slice(0, 2));
          }

          return NextResponse.json(transformedData);
        } catch (error) {
          console.error(`${pkgManager} search error:`, error);
          return NextResponse.json({ error: `Failed to fetch ${pkgManager} package data` }, { status: 500 });
        }

      default:
        return NextResponse.json({ error: 'Unsupported OS' }, { status: 400 });
    }

    console.log('Fetching from:', url);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SoftStacker/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch package data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data).slice(0, 200));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Package search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package data' },
      { status: 500 }
    );
  }
} 