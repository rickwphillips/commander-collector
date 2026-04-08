/**
 * lib/cards/index.ts — barrel for all card primitives.
 *
 * Modules owned by this agent (Phase 0 — Card primitives bundle):
 *   types       — canonical Card interface + fromApiCard / toApiCard adapters
 *   fromScryfall — cardFromScryfall(name, data, opts?) builder
 *   tempId      — tempId() ephemeral key generator
 *
 * Modules owned by other Phase 0 agents (will exist before tests run):
 *   categorize  — categorizeByType()
 *   filter      — filterCards() / sortCards() + FilterSortState
 *   colorIdentity — canonical color-identity computation
 *   matchKey    — matchKey() / normalize() for dedup
 */

export * from './types';
export * from './fromScryfall';
export * from './tempId';

export * from './categorize';
export * from './colorIdentity';
export * from './matchKey';
export * from './mergeIntoBuffer';
