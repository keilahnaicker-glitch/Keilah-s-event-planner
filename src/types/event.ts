export type EventType =
  | 'Birthdays'
  | 'Graduations'
  | 'Weddings'
  | 'Engagements'
  | 'Anniversaries'
  | 'Baby showers'
  | 'Bridal showers'
  | 'Church events'
  | 'Youth events'
  | 'Corporate events'
  | 'Conferences'
  | 'Dinners'
  | 'Family gatherings'
  | 'Memorials'
  | 'Reunions'
  | 'Farewell parties'
  | 'Fundraisers'
  | 'Award ceremonies'
  | 'Christmas parties'
  | 'Cultural celebrations'
  | 'Other / Custom Event';

export type IndoorOutdoor = 'Indoor' | 'Outdoor' | 'Hybrid';

export type CurrencyCode = 'ZAR' | 'USD' | 'GBP' | 'EUR' | 'AUD' | 'CAD' | 'INR' | string;

export interface ColorPaletteItem {
  name: string;
  hex: string;
  usage: string;
}

export type GuestCategory =
  | 'Family'
  | 'Friends'
  | 'Work'
  | 'Church'
  | 'School/University'
  | 'VIP'
  | 'Children'
  | 'Other';

export type RSVPStatus = 'Invited' | 'Confirmed' | 'Declined' | 'Pending';

export type AgeGroup = 'Adult' | 'Child' | 'Elderly' | 'Teen';

export interface Guest {
  id: string;
  name: string;
  surname: string;
  category: GuestCategory;
  rsvp: RSVPStatus;
  plusOne: boolean;
  familyGroup?: string;
  isVip: boolean;
  ageGroup: AgeGroup;
  dietary: string[];
  allergies: string[];
  accessibility: string[];
  preferredTable?: string;
  mustSitWith?: string[]; // guest IDs or names
  preferToSitWith?: string[];
  shouldNotSitWith?: string[];
  notes?: string;
}

export type TableShape = 'Round' | 'Rectangle' | 'Square' | 'Long banquet' | 'Custom';

export interface Table {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  isLocked?: boolean;
}

export interface SeatingAssignment {
  tableId: string;
  guestIds: string[];
}

export type BudgetCategory =
  | 'Venue'
  | 'Food'
  | 'Drinks'
  | 'Cake'
  | 'Décor'
  | 'Entertainment'
  | 'Photography'
  | 'Videography'
  | 'Invitations'
  | 'Transport'
  | 'Gifts'
  | 'Party favours'
  | 'Clothing'
  | 'Equipment'
  | 'Staff'
  | 'Emergency fund'
  | 'Other';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  name: string;
  plannedCost: number;
  actualCost: number;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  time: string; // e.g. "18:00"
  activity: string;
  durationMinutes: number;
  responsiblePerson: string;
  notes?: string;
  dependencies?: string;
  isBuffer?: boolean;
}

export type ShoppingCategory =
  | 'Food'
  | 'Drinks'
  | 'Décor'
  | 'Tableware'
  | 'Serving items'
  | 'Cleaning supplies'
  | 'Cake/dessert'
  | 'Emergency supplies'
  | 'Stationery'
  | 'Signage'
  | 'Party favours'
  | 'Miscellaneous';

export interface ShoppingItem {
  id: string;
  item: string;
  category: ShoppingCategory;
  quantity: string;
  estimatedCost: number;
  purchased: boolean;
  notes?: string;
  autoDerived?: boolean;
}

export interface TaskItem {
  id: string;
  task: string;
  category: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Done';
}

export interface GeneratedEventPlan {
  overview: {
    eventName: string;
    type: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    theme: string;
    mainObjective: string;
  };
  concept: {
    atmosphere: string;
    themeInterpretation: string;
    stylingDirection: string;
    memorableFeatureIdeas: string[];
  };
  colourPalette: ColorPaletteItem[];
  decorPlan: {
    tables: string;
    centrepieces: string;
    backdrop: string;
    entrance: string;
    signage: string;
    lighting: string;
    flowers: string;
    candles: string;
    tableStyling: string;
    stageOrPodium: string;
    photoArea: string;
  };
  foodPlan: {
    mealStyle: string;
    recommendations: string[];
    dietaryNotes: string;
    drinksPairing: string[];
  };
  cakeDessert: {
    cakeConcept: string;
    dessertOptions: string[];
  };
  entertainment: {
    mainActivities: string[];
    musicDirection: string;
    guestEngagement: string;
  };
  photography: {
    importantPhotos: string[];
    photoMoments: string[];
    photoBoothConcept: string;
    groupPhotoTiming: string;
    memorableShots: string[];
  };
  wowFactor: string[]; // 3-5 unique touches
  risks: string[];
  nextActions: {
    urgent: string[];
    soon: string[];
    later: string[];
  };
}

export interface GiftRecipientProfile {
  recipient: string;
  age: string;
  relationship: string;
  interests: string;
  personality: string;
  giftBudget: number;
  currency: string;
  location?: string;
  event?: string;
}

export interface GiftRecommendation {
  gift: string;
  category: 'Safe Choices' | 'Personal Gifts' | 'Creative Gifts' | 'Experience Gifts' | 'Budget-Friendly' | 'Special / Memorable';
  why: string;
  priceRange: string;
}

export interface ContingencyPlan {
  id: string;
  trigger: string;
  immediateActions: string[];
  planB: string;
  whoToContact: string;
  eventImpact: string;
  updatedTimeline: string;
}

export interface EventData {
  id: string;
  eventName: string;
  eventType: EventType;
  customEventType?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  venue: string;
  venueCapacity?: number;
  indoorOutdoor: IndoorOutdoor;
  guestCount: number;
  budget: number;
  currency: CurrencyCode;
  theme: string;
  vibe: string;
  formality: string;
  colourPalette: ColorPaletteItem[];
  mealStyle: string;
  dietaryRequirements: string[];
  allergies: string[];
  accessibilityRequirements: string[];
  specialRequirements: {
    childrenAttending: boolean;
    elderlyGuests: boolean;
    vipGuests: boolean;
    religiousOrCultural: string;
    speeches: boolean;
    entertainment: boolean;
    photography: boolean;
    videography: boolean;
    music: boolean;
    giftGiving: boolean;
    specialSurprises: boolean;
    customNotes: string;
  };
  cakeRequirements: string;
  drinksRequirements: string;
  guestList: Guest[];
  tables: Table[];
  seatingPlan: SeatingAssignment[];
  schedule: ScheduleItem[];
  budgetItems: BudgetItem[];
  shoppingList: ShoppingItem[];
  tasks: TaskItem[];
  giftRecipient?: GiftRecipientProfile;
  contingencyPlans: ContingencyPlan[];
  aiPlan?: GeneratedEventPlan;
  notes: string;
  lastUpdated: string;
}

export interface InterconnectedChangeNotice {
  previousCount: number;
  newCount: number;
  tableDifference: number;
  foodScalingPercent: number;
  budgetDifference: number;
  scheduleTimingImpact: string;
  affectedAreas: string[];
}
