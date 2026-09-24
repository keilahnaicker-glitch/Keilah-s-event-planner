import { EventData, Guest, Table, ScheduleItem, BudgetItem, ShoppingItem, TaskItem } from '../types/event';

export function createEmptyEvent(): EventData {
  return {
    id: `event-${Date.now()}`,
    eventName: '',
    eventType: 'Birthdays',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '22:30',
    location: '',
    venue: '',
    venueCapacity: 100,
    indoorOutdoor: 'Indoor',
    guestCount: 50,
    budget: 20000,
    currency: 'ZAR',
    theme: '',
    vibe: 'Elegant',
    formality: 'Semi-Formal',
    colourPalette: [
      { name: 'Warm Cream', hex: '#FDFBF7', usage: 'Linens, stationery and base lighting' },
      { name: 'Champagne Gold', hex: '#D4AF37', usage: 'Cutlery, candleholders and accent signage' },
      { name: 'Deep Plum', hex: '#4A154B', usage: 'Floral centerpieces, napkins and menus' },
      { name: 'Soft Lavender', hex: '#E6E6FA', usage: 'Ambient uplighting and delicate florals' },
    ],
    mealStyle: 'Buffet',
    dietaryRequirements: [],
    allergies: [],
    accessibilityRequirements: [],
    specialRequirements: {
      childrenAttending: false,
      elderlyGuests: true,
      vipGuests: false,
      religiousOrCultural: '',
      speeches: true,
      entertainment: true,
      photography: true,
      videography: false,
      music: true,
      giftGiving: true,
      specialSurprises: false,
      customNotes: '',
    },
    cakeRequirements: 'Two-tier celebratory cake',
    drinksRequirements: 'Wine, champagne toast, mocktails, juices & sparkling water',
    guestList: [],
    tables: [
      { id: 't-1', name: 'Table 1', shape: 'Round', capacity: 10 },
      { id: 't-2', name: 'Table 2', shape: 'Round', capacity: 10 },
      { id: 't-3', name: 'Table 3', shape: 'Round', capacity: 10 },
      { id: 't-4', name: 'Table 4', shape: 'Round', capacity: 10 },
      { id: 't-5', name: 'Table 5', shape: 'Round', capacity: 10 },
    ],
    seatingPlan: [
      { tableId: 't-1', guestIds: [] },
      { tableId: 't-2', guestIds: [] },
      { tableId: 't-3', guestIds: [] },
      { tableId: 't-4', guestIds: [] },
      { tableId: 't-5', guestIds: [] },
    ],
    schedule: [
      { id: 's-1', time: '17:00', activity: 'Venue & Vendor Setup', durationMinutes: 45, responsiblePerson: 'Lead Coordinator' },
      { id: 's-2', time: '17:45', activity: 'Sound Check & Lighting Final Polish', durationMinutes: 15, responsiblePerson: 'AV Technician' },
      { id: 's-3', time: '18:00', activity: 'Guest Arrival & Welcome Drinks', durationMinutes: 30, responsiblePerson: 'Host Team' },
      { id: 's-4', time: '18:30', activity: 'Welcome Address & Icebreaker', durationMinutes: 15, responsiblePerson: 'Master of Ceremonies' },
      { id: 's-5', time: '18:45', activity: 'Starter / Canapés Service', durationMinutes: 30, responsiblePerson: 'Catering Lead' },
      { id: 's-6', time: '19:15', activity: 'Speeches & Tributes', durationMinutes: 25, responsiblePerson: 'Key Speakers' },
      { id: 's-7', time: '19:40', activity: 'Main Dinner Service', durationMinutes: 50, responsiblePerson: 'Catering Lead' },
      { id: 's-8', time: '20:30', activity: 'Celebratory Cake Cutting & Toast', durationMinutes: 15, responsiblePerson: 'Guest of Honor' },
      { id: 's-9', time: '20:45', activity: 'Entertainment & Dancing', durationMinutes: 75, responsiblePerson: 'DJ / Band' },
      { id: 's-10', time: '22:00', activity: 'Farewell & Favor Distribution', durationMinutes: 30, responsiblePerson: 'Host Team' },
    ],
    budgetItems: [
      { id: 'b-1', category: 'Venue', name: 'Main Reception Hall Hire', plannedCost: 6500, actualCost: 6500 },
      { id: 'b-2', category: 'Food', name: 'Dinner & Canapés Catering (per head)', plannedCost: 6000, actualCost: 5800 },
      { id: 'b-3', category: 'Drinks', name: 'Bar, Toast & Beverages', plannedCost: 2000, actualCost: 2100 },
      { id: 'b-4', category: 'Cake', name: 'Custom Celebratory Cake', plannedCost: 900, actualCost: 900 },
      { id: 'b-5', category: 'Décor', name: 'Florals, Linens, Centerpieces & Backdrop', plannedCost: 2000, actualCost: 1950 },
      { id: 'b-6', category: 'Entertainment', name: 'Sound System & DJ', plannedCost: 1200, actualCost: 1200 },
      { id: 'b-7', category: 'Photography', name: 'Event Photographer (4 Hours)', plannedCost: 800, actualCost: 800 },
      { id: 'b-8', category: 'Party favours', name: 'Guest Favours & Keepsakes', plannedCost: 400, actualCost: 350 },
      { id: 'b-9', category: 'Emergency fund', name: 'Contingency Reserve (10%)', plannedCost: 2000, actualCost: 0 },
    ],
    shoppingList: [
      { id: 'sh-1', category: 'Décor', item: 'Taper candles & gold holders', quantity: '24 units', estimatedCost: 450, purchased: false },
      { id: 'sh-2', category: 'Décor', item: 'Printed custom welcome signage & easel', quantity: '1 piece', estimatedCost: 320, purchased: true },
      { id: 'sh-3', category: 'Tableware', item: 'Plum cloth napkins & gold rings', quantity: '55 units', estimatedCost: 550, purchased: false },
      { id: 'sh-4', category: 'Drinks', item: 'Sparkling wine for celebration toast', quantity: '12 bottles', estimatedCost: 960, purchased: false },
      { id: 'sh-5', category: 'Party favours', item: 'Custom keepsake gift boxes with artisan treats', quantity: '50 units', estimatedCost: 400, purchased: false },
      { id: 'sh-6', category: 'Stationery', item: 'Table numbers and place cards', quantity: '5 sets', estimatedCost: 180, purchased: true },
    ],
    tasks: [
      { id: 't-1', task: 'Finalise venue contract & deposit', category: 'Venue', deadline: '2026-10-01', priority: 'High', status: 'Done' },
      { id: 't-2', task: 'Send formal invitations & track RSVPs', category: 'Guests', deadline: '2026-10-08', priority: 'High', status: 'In Progress' },
      { id: 't-3', task: 'Finalise menu selection & dietary list with caterer', category: 'Food', deadline: '2026-10-15', priority: 'High', status: 'In Progress' },
      { id: 't-4', task: 'Confirm seating layout and print place cards', category: 'Seating', deadline: '2026-10-18', priority: 'Medium', status: 'Not Started' },
      { id: 't-5', task: 'Brief photographer on key timeline moments', category: 'Vendors', deadline: '2026-10-20', priority: 'Medium', status: 'Not Started' },
      { id: 't-6', task: 'Prepare backup audio playlist & emergency kit', category: 'Plan B', deadline: '2026-10-22', priority: 'Low', status: 'Not Started' },
    ],
    contingencyPlans: [
      {
        id: 'c-1',
        trigger: 'Rain or inclement weather',
        immediateActions: ['Move welcome drinks to the sheltered veranda', 'Engage portable heaters', 'Deploy umbrella hospitality bucket at entrance'],
        planB: 'Relocate courtyard reception into the secondary conservatory pavilion.',
        whoToContact: 'Venue Manager (Sarah) & Catering Coordinator',
        eventImpact: 'Outdoor mingling shifted indoors; no photos in open garden.',
        updatedTimeline: 'No time delays; sheltered photo backdrop engaged immediately.'
      },
      {
        id: 'c-2',
        trigger: 'Caterer is delayed or key vendor late',
        immediateActions: ['Serve extra amuse-bouche and welcome drinks', 'Extend live background music acoustic set by 20 minutes', 'Keep guests relaxed in reception lounge'],
        planB: 'Swap speech segment earlier to keep the room entertained while kitchen finalises plating.',
        whoToContact: 'Head Chef & MC',
        eventImpact: 'Speeches occur at 19:00 instead of 19:15.',
        updatedTimeline: 'Dinner served at 19:45; entertainment shifts by 15 minutes.'
      }
    ],
    notes: 'Prioritise a warm, refined atmosphere with soft acoustic music during dinner.',
    lastUpdated: new Date().toISOString(),
  };
}

export function createSampleCelebration(): EventData {
  const base = createEmptyEvent();
  base.eventName = 'Keisha’s Honors Graduation Gala';
  base.eventType = 'Graduations';
  base.location = 'Cape Town, Western Cape';
  base.venue = 'The Grand Conservatory Pavilion';
  base.venueCapacity = 85;
  base.indoorOutdoor = 'Hybrid';
  base.guestCount = 50;
  base.budget = 25000;
  base.currency = 'ZAR';
  base.theme = 'Black Tie Academic Excellence';
  base.vibe = 'Elegant, Proud & Joyful';
  base.formality = 'Formal';
  base.notes = 'Honoring Keisha’s Master’s degree with close family, university mentors, and lifelong friends.';

  const mockGuests: Guest[] = [
    { id: 'g-1', name: 'Keisha', surname: 'Naidoo', category: 'VIP', rsvp: 'Confirmed', plusOne: false, isVip: true, ageGroup: 'Adult', dietary: ['Vegetarian'], allergies: ['Peanuts'], accessibility: [], mustSitWith: ['Marcus Naidoo', 'Elena Naidoo'], notes: 'Guest of Honor' },
    { id: 'g-2', name: 'Marcus', surname: 'Naidoo', category: 'Family', rsvp: 'Confirmed', plusOne: false, isVip: true, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [], mustSitWith: ['Keisha Naidoo'] },
    { id: 'g-3', name: 'Elena', surname: 'Naidoo', category: 'Family', rsvp: 'Confirmed', plusOne: false, isVip: true, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: ['Ground level seating (Grandmother)'], mustSitWith: ['Keisha Naidoo'] },
    { id: 'g-4', name: 'Prof. David', surname: 'Venter', category: 'School/University', rsvp: 'Confirmed', plusOne: true, isVip: true, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-5', name: 'Dr. Amina', surname: 'Patel', category: 'School/University', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: ['Halal'], allergies: [], accessibility: [] },
    { id: 'g-6', name: 'Tariq', surname: 'Patel', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: ['Halal'], allergies: [], accessibility: [] },
    { id: 'g-7', name: 'Chloe', surname: 'Van Zyl', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: ['Vegan'], allergies: [], accessibility: [] },
    { id: 'g-8', name: 'Liam', surname: 'Smit', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [], shouldNotSitWith: ['Derek Botha'] },
    { id: 'g-9', name: 'Derek', surname: 'Botha', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [], shouldNotSitWith: ['Liam Smit'] },
    { id: 'g-10', name: 'Zandile', surname: 'Khumalo', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-11', name: 'Bongani', surname: 'Khumalo', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-12', name: 'Auntie Thandi', surname: 'Mabaso', category: 'Family', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Elderly', dietary: ['Diabetic friendly'], allergies: [], accessibility: ['Needs wheelchair clearance'] },
    { id: 'g-13', name: 'Uncle Sipho', surname: 'Mabaso', category: 'Family', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Elderly', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-14', name: 'Jason', surname: 'Lee', category: 'Work', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: ['Shellfish'], accessibility: [] },
    { id: 'g-15', name: 'Priya', surname: 'Govender', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: ['Vegetarian'], allergies: [], accessibility: [] },
    { id: 'g-16', name: 'Devan', surname: 'Govender', category: 'Friends', rsvp: 'Pending', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-17', name: 'Sihle', surname: 'Dlamini', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-18', name: 'Nandi', surname: 'Dlamini', category: 'Friends', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-19', name: 'Kiran', surname: 'Pillay', category: 'Family', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
    { id: 'g-20', name: 'Samantha', surname: 'Pillay', category: 'Family', rsvp: 'Confirmed', plusOne: false, isVip: false, ageGroup: 'Adult', dietary: [], allergies: [], accessibility: [] },
  ];

  base.guestList = mockGuests;
  base.guestCount = 50;

  // Initialize seating assignments with known guests
  base.seatingPlan = [
    { tableId: 't-1', guestIds: ['g-1', 'g-2', 'g-3', 'g-4'] },
    { tableId: 't-2', guestIds: ['g-5', 'g-6', 'g-7', 'g-8', 'g-10'] },
    { tableId: 't-3', guestIds: ['g-9', 'g-11', 'g-14', 'g-15'] },
    { tableId: 't-4', guestIds: ['g-12', 'g-13', 'g-19', 'g-20'] },
    { tableId: 't-5', guestIds: ['g-17', 'g-18'] },
  ];

  return base;
}

export const DEFAULT_EVENTS: EventData[] = [
  createSampleCelebration(),
];
