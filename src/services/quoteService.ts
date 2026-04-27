// ====================================================================
// ArtoCamello — Quote / Budget Service (Mock)
// ====================================================================
import { Quote, QuoteStatus, RequestStatus } from '../domain/types';
import { getDB, updateDB, generateId } from '../mocks/db';

export interface SubmitQuotePayload {
  requestId: string;
  professionalId: string;
  message: string;
  estimatedPrice: number;
  estimatedDays?: number;
}

/**
 * Submit a quote for a request. The professional must have purchased the contact first.
 */
export function submitQuote(payload: SubmitQuotePayload): Quote | null {
  const db = getDB();

  // Verify professional has purchased the lead
  const purchase = db.leadPurchases.find(
    lp => lp.requestId === payload.requestId && lp.professionalId === payload.professionalId
  );
  if (!purchase) return null;

  // Check if already submitted a quote
  const existing = db.quotes.find(
    q => q.requestId === payload.requestId && q.professionalId === payload.professionalId
  );
  if (existing) return null;

  const quote: Quote = {
    id: generateId('q'),
    requestId: payload.requestId,
    professionalId: payload.professionalId,
    message: payload.message,
    estimatedPrice: payload.estimatedPrice,
    estimatedDays: payload.estimatedDays,
    status: QuoteStatus.SENT,
    createdAt: new Date().toISOString(),
  };

  updateDB(db => {
    db.quotes.push(quote);

    // Update request status if it has enough quotes
    const request = db.requests.find(r => r.id === payload.requestId);
    if (request) {
      const quoteCount = db.quotes.filter(q => q.requestId === payload.requestId).length;
      if (quoteCount >= 1 && request.status === RequestStatus.CONTACT_LIMIT_OPEN) {
        request.status = RequestStatus.QUOTES_RECEIVED;
        request.updatedAt = new Date().toISOString();
      }
    }
  });

  return quote;
}

/**
 * List all quotes for a specific request.
 * Enriches with professional profile info.
 */
export function listQuotesByRequest(requestId: string): Array<{
  quote: Quote;
  professionalName: string;
  professionalRating: number;
  professionalReviewCount: number;
  professionalAvatar?: string;
}> {
  const db = getDB();
  const quotes = db.quotes.filter(q => q.requestId === requestId);

  return quotes.map(q => {
    const user = db.users.find(u => u.id === q.professionalId);
    const profile = db.proProfiles.find(p => p.userId === q.professionalId);
    return {
      quote: q,
      professionalName: user?.fullName || 'Profesional',
      professionalRating: profile?.rating || 0,
      professionalReviewCount: profile?.reviewCount || 0,
      professionalAvatar: user?.avatarUrl,
    };
  }).sort((a, b) => new Date(a.quote.createdAt).getTime() - new Date(b.quote.createdAt).getTime());
}

/**
 * Accept a quote (client action). Sets the request to HIRED status.
 */
export function acceptQuote(quoteId: string): boolean {
  let success = false;
  updateDB(db => {
    const quote = db.quotes.find(q => q.id === quoteId);
    if (!quote) return;

    quote.status = QuoteStatus.ACCEPTED;

    // Reject all other quotes for this request
    db.quotes
      .filter(q => q.requestId === quote.requestId && q.id !== quoteId)
      .forEach(q => { q.status = QuoteStatus.REJECTED; });

    // Update request status
    const request = db.requests.find(r => r.id === quote.requestId);
    if (request) {
      request.status = RequestStatus.HIRED;
      request.updatedAt = new Date().toISOString();
    }
    success = true;
  });
  return success;
}

/**
 * List quotes sent by a specific professional.
 */
export function listQuotesByProfessional(professionalId: string): Quote[] {
  const db = getDB();
  return db.quotes
    .filter(q => q.professionalId === professionalId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
