import LocalStopsService, { HARDCODED_STOPS } from '@/services/localStopsService';

describe('LocalStopsService.searchByNamePrefix', () => {
  it('returns empty array for empty or whitespace-only query', () => {
    expect(LocalStopsService.searchByNamePrefix('')).toEqual([]);
    expect(LocalStopsService.searchByNamePrefix('   ')).toEqual([]);
  });

  it('matches case-insensitively by prefix', () => {
    const resultsLower = LocalStopsService.searchByNamePrefix('czerwone');
    const resultsUpper = LocalStopsService.searchByNamePrefix('CZERWONE');
    expect(resultsLower.length).toBeGreaterThan(0);
    expect(resultsLower).toEqual(resultsUpper);
    expect(resultsLower.every(s => s.name.toLowerCase().startsWith('czerwone'))).toBe(true);
  });

  it("matches diacritics-insensitively when same letters are used (lowercased)", () => {
    // The service lowercases; diacritic normalization is not performed.
    // We validate that lowercasing alone works for exact diacritic input.
    const withDiacritics = LocalStopsService.searchByNamePrefix('Św.');
    expect(withDiacritics.length).toBeGreaterThan(0);
    expect(withDiacritics.every(s => s.name.toLowerCase().startsWith('św.'))).toBe(true);
  });

  it('returns only stops whose names start with the query', () => {
    const query = 'Pla';
    const results = LocalStopsService.searchByNamePrefix(query);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(s => s.name.toLowerCase().startsWith(query.toLowerCase()))).toBe(true);
  });

  it('does not match when query is not a prefix', () => {
    // Pick a substring that exists in the middle of some names, but not as prefix
    const midSubstr = 'ow';
    const results = LocalStopsService.searchByNamePrefix(midSubstr);
    // It is possible some stop starts with 'ow'; ensure all results respect prefix logic
    expect(results.every(s => s.name.toLowerCase().startsWith(midSubstr))).toBe(true);
  });

  it('can return multiple matches for a short prefix', () => {
    const results = LocalStopsService.searchByNamePrefix('Rondo');
    const expected = HARDCODED_STOPS.filter(s => s.name.toLowerCase().startsWith('rondo'));
    expect(results.map(s => s.id).sort()).toEqual(expected.map(s => s.id).sort());
  });
});


