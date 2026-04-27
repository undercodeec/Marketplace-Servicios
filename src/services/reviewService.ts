// ====================================================================
// ArtoCamello — Review Service (Mock)
// ====================================================================
import { Review, RequestStatus } from '../domain/types';
import { getDB, updateDB, generateId } from '../mocks/db';

export interface CreateReviewPayload {
  requestId: string;
  clientId: string;
  professionalId: string;
  rating: number;
  comment: string;
}

/**
 * Create a review for a completed request.
 * Only completed requests can have reviews.
 */
export function createReview(payload: CreateReviewPayload): Review | null {
  const db = getDB();

  const request = db.requests.find(r => r.id === payload.requestId);
  if (!request || request.status !== RequestStatus.COMPLETED) return null;

  // Check if review already exists
  const existing = db.reviews.find(r => r.requestId === payload.requestId);
  if (existing) return null;

  const review: Review = {
    id: generateId('rev'),
    ...payload,
    createdAt: new Date().toISOString(),
  };

  updateDB(db => {
    db.reviews.push(review);

    // Update professional profile rating
    const profile = db.proProfiles.find(p => p.userId === payload.professionalId);
    if (profile) {
      const allReviews = db.reviews.filter(r => r.professionalId === payload.professionalId);
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      profile.rating = Math.round(avgRating * 10) / 10;
      profile.reviewCount = allReviews.length;
    }
  });

  return review;
}

/**
 * List all reviews for a professional.
 */
export function getReviewsByProfessional(professionalId: string): Review[] {
  const db = getDB();
  return db.reviews
    .filter(r => r.professionalId === professionalId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get review for a specific request (if any).
 */
export function getReviewByRequest(requestId: string): Review | null {
  const db = getDB();
  return db.reviews.find(r => r.requestId === requestId) || null;
}
