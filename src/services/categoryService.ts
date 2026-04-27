// ====================================================================
// ArtoCamello — Category Service (Mock)
// ====================================================================
import { ServiceCategory } from '../domain/types';
import { getDB } from '../mocks/db';

/**
 * Get all service categories.
 */
export function getAllCategories(): ServiceCategory[] {
  return getDB().categories;
}

/**
 * Get a category by slug.
 */
export function getCategoryBySlug(slug: string): ServiceCategory | null {
  return getDB().categories.find(c => c.slug === slug) || null;
}

/**
 * Search categories by name (fuzzy).
 */
export function searchCategories(query: string): ServiceCategory[] {
  const lower = query.toLowerCase();
  return getDB().categories.filter(c =>
    c.name.toLowerCase().includes(lower) ||
    c.description.toLowerCase().includes(lower)
  );
}
