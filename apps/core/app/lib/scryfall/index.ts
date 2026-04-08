/**
 * Barrel — re-exports the unified Scryfall client.
 *
 * Import from here rather than directly from './client':
 *   import { lookupByName, bulkLookupByName } from '@/lib/scryfall';
 */

export type {
  ScryfallCachedCard,
  ScryfallSearchOptions,
  ScryfallSearchResult,
} from './client';

export {
  lookupByName,
  lookupById,
  bulkLookupByName,
  getPrints,
  search,
} from './client';
