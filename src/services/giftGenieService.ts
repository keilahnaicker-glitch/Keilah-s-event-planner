import { GiftRecipientProfile, GiftRecommendation } from '../types/event';

export type GiftGenieFilter = 'all' | 'cheaper' | 'personal' | 'unique' | 'more';

export function generateGiftIdeas(
  profile: GiftRecipientProfile,
  filter: GiftGenieFilter = 'all'
): GiftRecommendation[] {
  const budget = profile.giftBudget || 500;
  const currency = profile.currency || 'ZAR';
  const interests = profile.interests || 'reading, travel, art, technology';
  const event = profile.event || 'Celebration';
  const name = profile.recipient || 'the recipient';
  const relation = profile.relationship || 'friend';

  // Base smart generation pool tailored to event and interests
  const basePool: GiftRecommendation[] = [
    // Safe Choices
    {
      gift: 'Curated Gourmet Tasting Hamper & Artisan Coffee/Tea Selection',
      category: 'Safe Choices',
      why: `Universally appreciated for ${event}; allows ${name} to celebrate comfortably without risk of sizing or styling mismatch.`,
      priceRange: `${currency} ${Math.round(budget * 0.35)} – ${Math.round(budget * 0.55)}`,
    },
    {
      gift: 'Premium Minimalist Leather Cardholder or Tech Folio',
      category: 'Safe Choices',
      why: `Sleek, functional, and durable. Pairs wonderfully with ${name}’s professional milestones and daily routine.`,
      priceRange: `${currency} ${Math.round(budget * 0.45)} – ${Math.round(budget * 0.7)}`,
    },

    // Personal Gifts
    {
      gift: 'Custom Engraved Keepsake (Fountain Pen, Watch Back, or Coordinates Bar)',
      category: 'Personal Gifts',
      why: `Commemorates the specific date of this ${event} with a deeply personal message celebrating your bond as ${relation}.`,
      priceRange: `${currency} ${Math.round(budget * 0.5)} – ${Math.round(budget * 0.85)}`,
    },
    {
      gift: 'Bespoke Hardcover Memory Book & Milestone Photobook',
      category: 'Personal Gifts',
      why: `Gathers photos and well-wishes from friends and family, reflecting ${name}’s distinct personality and journey.`,
      priceRange: `${currency} ${Math.round(budget * 0.3)} – ${Math.round(budget * 0.5)}`,
    },

    // Creative Gifts
    {
      gift: 'Custom Digital Portrait or City Map Print in Gold Leaf Frame',
      category: 'Creative Gifts',
      why: `Translates ${name}’s interests in ${interests} into striking visual wall art celebrating their journey.`,
      priceRange: `${currency} ${Math.round(budget * 0.4)} – ${Math.round(budget * 0.75)}`,
    },
    {
      gift: 'Bespoke Scent Atelier Kit or Hand-Poured Botanical Fragrance Set',
      category: 'Creative Gifts',
      why: `An inspiring, sensory experience allowing ${name} to blend their own custom room or personal fragrance.`,
      priceRange: `${currency} ${Math.round(budget * 0.35)} – ${Math.round(budget * 0.6)}`,
    },

    // Experience Gifts
    {
      gift: 'Scenic Sunset Vineyard Tasting or High Tea Experience Voucher',
      category: 'Experience Gifts',
      why: `Offers relaxing memories long after the event, perfect for celebrating an honors graduation or birthday milestone.`,
      priceRange: `${currency} ${Math.round(budget * 0.6)} – ${Math.round(budget * 1.0)}`,
    },
    {
      gift: 'Masterclass or Private Artisan Workshop (Pottery, Cooking, or Photography)',
      category: 'Experience Gifts',
      why: `Directly engages ${name}’s passion for ${interests} while providing an unforgettable hands-on weekend adventure.`,
      priceRange: `${currency} ${Math.round(budget * 0.5)} – ${Math.round(budget * 0.9)}`,
    },

    // Budget-Friendly
    {
      gift: 'Artisanal Candle with Seed Paper Planting Card & Special Notes Jar',
      category: 'Budget-Friendly',
      why: `Heartfelt and aesthetic without financial stress. The seed paper blossoms into wildflowers as a living memory.`,
      priceRange: `${currency} ${Math.round(budget * 0.15)} – ${Math.round(budget * 0.3)}`,
    },
    {
      gift: 'Personalized Bookmark & Bestseller Edition in Their Favorite Genre',
      category: 'Budget-Friendly',
      why: `Thoughtful, intellectual, and affordable. Shows you truly listen to their interests in ${interests}.`,
      priceRange: `${currency} ${Math.round(budget * 0.2)} – ${Math.round(budget * 0.35)}`,
    },

    // Special / Memorable
    {
      gift: 'Time-Capsule Champagne or Vintage Wine from Their Milestone Year',
      category: 'Special / Memorable',
      why: `A timeless gesture meant to be uncorked on their next major milestone anniversary or achievement.`,
      priceRange: `${currency} ${Math.round(budget * 0.7)} – ${Math.round(budget * 1.0)}`,
    },
    {
      gift: 'Custom Commissioned Audio Tribute or Framed Star Map of Event Night',
      category: 'Special / Memorable',
      why: `A once-in-a-lifetime centerpiece gift that captures the celestial alignment of this exact day forever.`,
      priceRange: `${currency} ${Math.round(budget * 0.6)} – ${Math.round(budget * 0.95)}`,
    },
  ];

  if (filter === 'cheaper') {
    return basePool
      .filter((g) => g.category === 'Budget-Friendly' || g.category === 'Safe Choices')
      .map((g) => ({
        ...g,
        gift: `[Budget Edition] ${g.gift}`,
        priceRange: `${currency} ${Math.round(budget * 0.1)} – ${Math.round(budget * 0.35)}`,
      }));
  }

  if (filter === 'personal') {
    return basePool.filter((g) => g.category === 'Personal Gifts' || g.category === 'Special / Memorable');
  }

  if (filter === 'unique') {
    return basePool.filter((g) => g.category === 'Creative Gifts' || g.category === 'Experience Gifts');
  }

  if (filter === 'more') {
    // Additional pool
    return [
      ...basePool,
      {
        gift: 'Handmade Italian Leather Journal with Brass Monogram Bookmark',
        category: 'Personal Gifts',
        why: `An elegant sanctuary for thoughts, goals, and recollections following ${event}.`,
        priceRange: `${currency} ${Math.round(budget * 0.35)} – ${Math.round(budget * 0.6)}`,
      },
      {
        gift: 'Interactive Smart Digital Picture Frame Preloaded with Memories',
        category: 'Creative Gifts',
        why: `Friends and family can remotely ping photos straight to ${name}’s desk anywhere in the world.`,
        priceRange: `${currency} ${Math.round(budget * 0.7)} – ${Math.round(budget * 1.0)}`,
      },
      {
        gift: 'Curated Relaxation & Aromatherapy Spa Recovery Box',
        category: 'Safe Choices',
        why: `The ultimate post-event decompression after months of hard work or study.`,
        priceRange: `${currency} ${Math.round(budget * 0.4)} – ${Math.round(budget * 0.65)}`,
      },
    ];
  }

  return basePool;
}
