import { EventData, GeneratedEventPlan, BudgetItem, ScheduleItem, ShoppingItem, TaskItem } from '../types/event';

/**
 * Builds the entire comprehensive event plan using all interconnected parameters.
 */
export async function buildMyEntireEvent(event: EventData): Promise<GeneratedEventPlan> {
  try {
    // Attempt backend Gemini generation if available
    const res = await fetch('/api/planora/build-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.plan) {
        return data.plan;
      }
    }
  } catch (err) {
    console.warn('Backend Gemini call unavailable, generating via Planora intelligent coordinator engine:', err);
  }

  // High-fidelity intelligent coordinator fallback
  return generateDeterministicFullPlan(event);
}

/**
 * Deterministic expert coordinator plan generator based strictly on event data.
 */
export function generateDeterministicFullPlan(event: EventData): GeneratedEventPlan {
  const isBudgetGenerous = event.budget >= (event.guestCount || 50) * 400;
  const isOutdoor = event.indoorOutdoor === 'Outdoor' || event.indoorOutdoor === 'Hybrid';

  const overview = {
    eventName: event.eventName || `${event.eventType} Celebration`,
    type: event.eventType,
    date: event.date,
    location: event.location || 'Selected Venue',
    guestCount: event.guestCount,
    budget: event.budget,
    theme: event.theme || `${event.vibe} Celebration`,
    mainObjective: `Host an unforgettable, stress-free ${event.eventType.toLowerCase()} that celebrates the guest of honor with warm hospitality and seamless execution.`,
  };

  const concept = {
    atmosphere: `An inviting blend of ${event.vibe.toLowerCase()} refinement and celebratory energy, designed to make every guest feel valued from arrival to departure.`,
    themeInterpretation: `Translates '${event.theme || event.vibe}' through tasteful tactile layers—ambient warm lighting, refined table settings, and cohesive accent tones rather than overstated gimmicks.`,
    stylingDirection: `Clean, modern luxury with cohesive ${event.colourPalette.map((c) => c.name).join(', ')} motifs, intentional negative space, and intimate conversation groupings.`,
    memorableFeatureIdeas: [
      `A signature welcome refreshment station infused with celebratory botanical garnishes.`,
      `An interactive guest memory wall featuring framed milestones and personal tribute cards.`,
      `Curated background acoustic transitions that subtly elevate in energy as the evening progresses.`,
    ],
  };

  const decorPlan = {
    tables: `Tables draped in textured ${event.colourPalette[0]?.name || 'Warm Cream'} linens, accented with ${event.colourPalette[1]?.name || 'Champagne Gold'} tableware and fine glassware.`,
    centrepieces: `Low-profile organic floral arrangements with seasonal blooms and nestled votives, ensuring uninterrupted across-table eye contact.`,
    backdrop: `A minimalist architectural arch or textured fabric drape adorned with asymmetric lush greenery and subtle LED halo rim-lighting.`,
    entrance: `A personalized easel welcome mirror with hand-lettered calligraphy, surrounded by hurricane pillar lanterns and fragrant foliage.`,
    signage: `Matte acrylic or textured parchment directional signage and table numbers in ${event.colourPalette[1]?.name || 'Champagne Gold'} script.`,
    lighting: `Warm 2700K ambient wash uplighting around the perimeter, dimmable pin-spots on focal stations, and abundant soft candlelight.`,
    flowers: `Locally sourced seasonal florals harmonized in ${event.colourPalette.map((c) => c.name).join(' & ')} palette, arranged with airy eucalyptus and olive branches.`,
    candles: `Non-drip unscented ivory pillar candles in varying heights inside hurricane glass cylinders for safety and elegance.`,
    tableStyling: `Charger plates with folded plum/cream cloth napkins, bespoke menu cards, and individual guest name tags tied with velvet ribbon.`,
    stageOrPodium: event.specialRequirements.speeches
      ? `A sleek modern acrylic podium positioned with clear sightlines from every table, flanked by two low floral pedestals.`
      : `No raised stage needed; intimate speech floor marker with warm spotlight.`,
    photoArea: `A dedicated portrait lounge with a comfortable velvet loveseat, floral meadow floor installation, and warm studio ring-lighting for flattering phone photos.`,
  };

  const foodPlan = {
    mealStyle: event.mealStyle,
    recommendations: [
      `Arrival: Passed artisanal canapés (brie & fig crostini, smoked salmon blinis, herb-marinated skewers).`,
      `Main Service: ${event.mealStyle} featuring slow-roasted herb-crusted protein, grilled seasonal harvest vegetables, and truffle-infused potatoes/grains.`,
      `Dietary Alternates: Dedicated plated vegan/halal/kosher options prepared separately to honor all guest restrictions.`,
    ],
    dietaryNotes: `All allergy notifications (${event.dietaryRequirements.join(', ') || 'standard'}) flagged directly with the head chef with isolated prep stations.`,
    drinksPairing: [
      `Signature Cocktail/Mocktail: Elderflower Champagne Spritz or Pomegranate Citrus Fizz.`,
      `Curated regional red and white wine selections, sparkling water with fresh citrus wedges.`,
    ],
  };

  const cakeDessert = {
    cakeConcept: event.cakeRequirements || `Two-tier semi-naked celebratory cake finished with fresh blooms, gold leaf flecks, and delicate textured buttercream.`,
    dessertOptions: [
      `Miniature artisan dessert shooters (passionfruit posset, dark chocolate mousse).`,
      `Fresh French macarons in palette colors for easy standing mingling.`,
    ],
  };

  const entertainment = {
    mainActivities: [
      `Arrival cocktail hour: Live acoustic guitar or string duet performing modern contemporary acoustic covers.`,
      `Post-dinner: Curated celebratory playlist / DJ set building toward lively dancefloor energy.`,
      `Interactive moment: A 10-minute heartfelt toast and celebratory montage reveal.`,
    ],
    musicDirection: `Subtle, conversational lounge soul during arrivals and dining, shifting into celebratory classics and crowd favorites after cake cutting.`,
    guestEngagement: `Thoughtful conversational icebreaker prompt cards on tables and a guestbook memory audio phone or polaroid station.`,
  };

  const photography = {
    importantPhotos: [
      `Guest of honor grand entrance & initial reactions`,
      `Key emotional speeches and audience laughter/tears`,
      `Formal family generation portrait with grandparents/mentors`,
      `Champagne toast & celebratory cake cutting`,
      `Candid interactions across dinner tables`,
    ],
    photoMoments: [
      `Golden hour twilight outdoor portraits (18:15)`,
      `Synchronized toast photo with all glasses raised (19:40)`,
      `Confetti or sparkler send-off climax (22:15)`,
    ],
    photoBoothConcept: `Open-air glam booth with a custom printed physical print strip and instant AirDrop / QR code sharing.`,
    groupPhotoTiming: `Immediately following welcome speeches while everyone is seated and looking their freshest.`,
    memorableShots: [
      `Close-up of bespoke place setting and stationery`,
      `Panoramic wide shot of the illuminated dining room full of laughing guests`,
    ],
  };

  const wowFactor = [
    `Personalized Handwritten Welcome Notes: A brief folded card at each guest place setting thanking them specifically for their presence.`,
    `Synchronized Candle Lighting: All table taper candles lit simultaneously right before speeches to cast a stunning warm glow across the room.`,
    `Surprise Late-Night Treat: Roaming trays of warm gourmet mini donuts or woodfired sliders delivered directly to the dance floor at 21:30.`,
    `Curated Scent Scaping: Subtle natural botanical reed diffusers placed in arrival vestibules and restrooms that guests will associate with the evening forever.`,
  ];

  const risks = [
    ...(event.venueCapacity && event.guestCount > event.venueCapacity
      ? [`Venue capacity limit exceeded (${event.guestCount} guests vs ${event.venueCapacity} cap).`]
      : []),
    ...(isOutdoor ? [`Outdoor weather exposure—requires guaranteed tent or sheltered rain contingency.`] : []),
    `Buffet queue bottlenecking if guest release is uncoordinated—requires table-by-table ushering.`,
    `Speeches running overtime—recommend assigning an MC with a gentle 3-minute visual cue.`,
  ];

  const nextActions = {
    urgent: [
      `Lock in primary venue contract and pay deposit.`,
      `Confirm caterer dietary capabilities and menu tasting date.`,
      `Finalize guest list invitations with strict RSVP deadline date.`,
    ],
    soon: [
      `Order custom stationery, place cards, and welcome easel signage.`,
      `Confirm audio sound system and book photographer timeline.`,
      `Draft initial table groupings using Planora Seating Planner.`,
    ],
    later: [
      `Review final RSVP count and trigger Planora Interconnected Recalculations.`,
      `Package guest favours and print run-of-show schedule for vendors.`,
      `Final vendor walkthrough and emergency kit packing.`,
    ],
  };

  return {
    overview,
    concept,
    colourPalette: event.colourPalette,
    decorPlan,
    foodPlan,
    cakeDessert,
    entertainment,
    photography,
    wowFactor,
    risks,
    nextActions,
  };
}

/**
 * Ask Planora AI assistant handler.
 */
export async function askPlanoraAI(
  userQuery: string,
  event: EventData,
  chatHistory: { role: 'user' | 'assistant'; text: string }[]
): Promise<string> {
  try {
    const res = await fetch('/api/planora/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery, event, history: chatHistory }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch (err) {
    console.warn('Backend Ask Planora offline, using local expert coordinator engine:', err);
  }

  // Intelligent fallback coordinator responses based on event context
  return generateDeterministicCoordinatorAnswer(userQuery, event);
}

function generateDeterministicCoordinatorAnswer(query: string, event: EventData): string {
  const q = query.toLowerCase();
  const currency = event.currency;
  const guests = event.guestCount;
  const budget = event.budget;

  if (q.includes('forgetting') || q.includes('what am i missing') || q.includes('checklist')) {
    return `Based on your ${event.eventType} for ${guests} guests, here are 4 easily overlooked items you should double-check:
1. **Vendor Meal Packets**: Have you accounted for catering for your photographer, DJ, and MC?
2. **Audio Microphone Batteries**: Ensure your sound technician has fresh backup 9V/AA batteries for speech mics.
3. **Emergency Hospitality Kit**: Pack lint rollers, safety pins, pain relief, double-sided tape, and stain remover pens.
4. **End-of-Night Transport & Gift Storage**: Appoint a designated family member or coordinator with a secure vehicle boot to collect gifts and leftover cake immediately after closing.`;
  }

  if (q.includes('save') || q.includes('cheaper') || q.includes('reduce cost') || q.includes('budget')) {
    return `To save money on your ${event.currency} ${budget.toLocaleString()} budget without hurting guest comfort:
• **Repurpose Ceremony / Entrance Florals**: Move your welcome florals straight to the cake table or head table after guest arrival.
• **Optimize Drink Selection**: Serve a signature welcome cocktail plus house wine and beer rather than an open hard-liquor bar. This alone can save 25–35% on beverage spend.
• **Stationery Simplification**: Switch individual menu cards to 2 elegant freestanding framed menus per table.
• **Favours**: Choose edible or dual-purpose favours (like personalized cookies that serve as place cards).`;
  }

  if (q.includes('table') || q.includes('seating') || q.includes('enough tables')) {
    const totalSeats = event.tables.reduce((acc, t) => acc + t.capacity, 0);
    const diff = totalSeats - guests;
    if (diff >= 0) {
      return `You currently have **${event.tables.length} tables** providing **${totalSeats} seats** for **${guests} guests** (a comfortable buffer of ${diff} extra seats). Your seating arrangement is well within capacity!`;
    } else {
      return `⚠️ Seating alert: You have ${totalSeats} seats across ${event.tables.length} tables for ${guests} guests. You have a **deficit of ${Math.abs(diff)} seats**. I recommend adding ${Math.ceil(Math.abs(diff) / 10)} additional table(s) or expanding table capacity.`;
    }
  }

  if (q.includes('food') || q.includes('how much food') || q.includes('portion')) {
    return `For ${guests} guests enjoying a ${event.mealStyle} meal over ${(event.schedule.length * 0.5 + 2).toFixed(1)} hours:
• **Proteins**: Plan approximately ${Math.round(guests * 0.22)} kg of chicken/meat/fish.
• **Carbohydrates & Sides**: Approximately ${Math.round(guests * 0.18)} kg total of rice, roasted potatoes, or grains.
• **Salads & Greens**: Approximately ${Math.round(guests * 0.12)} kg of mixed greens and artisanal salads.
• **Bread / Rolls**: 1.5 portions per guest (${Math.round(guests * 1.5)} units).
• **Drinks**: Plan for 3–4 beverage servings per person during an evening event (${Math.round(guests * 3.5)} servings total).`;
  }

  if (q.includes('special') || q.includes('unique') || q.includes('memorable') || q.includes('wow')) {
    return `Here are 3 unique touches tailored to your ${event.eventType} (${event.vibe} vibe):
1. **Audio Memory Phone or Tribute Record**: Instead of a traditional guestbook, place a vintage telephone where guests lift the receiver to record voice messages for the host.
2. **Synchronized Warm Welcome**: When the guest of honor arrives, have servers immediately hand out signature welcome glasses while acoustic music plays their favorite song.
3. **Personalized Gratitude Place Cards**: Leave a sealed mini-envelope at each seat with a two-sentence personalized handwritten note celebrating each guest's relationship with the honoree.`;
  }

  if (q.includes('speeches') || q.includes('schedule') || q.includes('before')) {
    return `For optimal flow, schedule speeches **before or between courses**, never when guests are hungry. A proven sequence for your timeline:
1. **18:00**: Welcome drinks & canapés (takes the edge off hunger).
2. **18:45**: First welcome toast & blessing (keep under 5 minutes).
3. **19:15**: Main meal service.
4. **19:50**: Key emotional speeches (capped at 3–4 minutes per speaker, with champagne in hand).
5. **20:20**: Cake cutting & energetic musical transition.`;
  }

  // General coordinator synthesis
  return `As your event coordinator for **${event.eventName || event.eventType}**, everything is designed to honor your **${event.theme || event.vibe}** aesthetic within your **${currency} ${budget.toLocaleString()}** budget for **${guests} guests**. 

Your current readiness score is tracking nicely. Would you like me to inspect your run-of-show timing, rebalance any recent budget changes, or generate fresh décor concepts for your tables?`;
}
