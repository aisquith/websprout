function v3StarterBase(type) {
  const t = (type || '').toLowerCase();
  const M = (re) => re.test(t);
  // [name, description, emoji-hex]
  if (M(/barber|barbershop|fade|men.?s grooming/)) return {
    category: 'barber', tagline: 'A sharp cut, every time.',
    about: 'Walk in for a classic cut or a modern fade. We take our time, line things up right, and send you out looking your best.',
    servicesTitle: 'What we do', ctaTitle: 'Ready for a fresh cut?', ctaText: 'Grab a chair and we will take care of the rest.',
    services: [['Haircut', 'A precise cut shaped to how you want to look and feel.', '1f488'], ['Skin Fade', 'Clean, blended fades from the skin up — crisp every time.', '2702'], ['Beard Trim', 'Shaped, lined up and conditioned so it looks intentional.', '1f9d4'], ['Hot Towel Shave', 'A traditional straight-razor shave with a hot-towel finish.', '1fa92']] };
  if (M(/\bpets?\b|(?<!hot )dog|groom|\bvet|kennel|boarding(?! school)|animal/)) return {
    category: 'pet', tagline: 'Love your pet as much as you do.',
    about: 'Gentle, attentive care from people who genuinely like animals. Your pet is in good hands — and you will see it when you pick them up.',
    servicesTitle: 'What we offer', ctaTitle: 'Give your pet the best.', ctaText: 'Tell us about your companion and we will set things up.',
    services: [['Grooming', 'Baths, cuts and nails that leave them fresh and happy.', '1f6c1'], ['Boarding', 'A safe, comfortable stay while you are away.', '1f3e1'], ['Daycare', 'Play, exercise and company all day long.', '1f415'], ['Wellness', 'Attentive care that keeps them feeling their best.', '1f43e']] };
  if (M(/\bhair|stylist|blowout/) || (M(/salon/) && !M(/nail|tann|lash|brow|\bwax|skin|massage/))) return {
    category: 'salon', tagline: 'Hair you will want to show off.',
    about: 'From a trim to a full transformation, we listen first and cut to suit you — your hair, your face, your routine.',
    servicesTitle: 'Services', ctaTitle: 'Let us find your look.', ctaText: 'Book a chair and tell us what you have in mind.',
    services: [['Cut & Style', 'A tailored cut finished exactly how you like to wear it.', '2702'], ['Color', 'Balayage, highlights or a full color, matched to your tone.', '1f3a8'], ['Blowout', 'Smooth, bouncy and ready for whatever is next.', '1f4a8'], ['Treatment', 'A deep conditioning or gloss to bring hair back to life.', '2728']] };
  if (M(/nail|\bspas?\b|day spa|lash|brow|\bwax|esthet|massage|beauty|facial|tann/)) return {
    category: 'spa', tagline: 'An hour that is just for you.',
    about: 'Step away from the noise. Our treatments are about taking care of yourself, done properly, in a space made to relax in.',
    servicesTitle: 'Treatments', ctaTitle: 'Treat yourself.', ctaText: 'Book a time that works and leave the rest to us.',
    services: [['Manicure', 'Shaped, buffed and finished in the color you choose.', '1f485'], ['Facial', 'A clean, glow-building facial suited to your skin.', '1f9d6'], ['Massage', 'Tension worked out at the pressure you prefer.', '1f486'], ['Lashes', 'Fuller, natural-looking lashes that last for weeks.', '1f441']] };
  if (M(/tattoo|piercing|\bink\b/)) return {
    category: 'tattoo', tagline: 'Art that stays with you.',
    about: 'Custom work, clean lines and a studio that takes aftercare seriously. Bring an idea or a reference and we will make it yours.',
    servicesTitle: 'What we do', ctaTitle: 'Have an idea?', ctaText: 'Send us your concept and we will set up a consult.',
    services: [['Custom Tattoo', 'Original work designed around your idea and placement.', '1f58b'], ['Fine Line', 'Delicate, precise linework for smaller pieces.', '270d'], ['Cover-Up', 'Thoughtful redesigns that give old ink new life.', '1f504'], ['Piercing', 'Safe, sterile piercings with jewelry to match.', '1f48e']] };
  if (M(/bak|pastry|patisserie|donut|bagel|bread/)) return {
    category: 'bakery', tagline: 'Baked fresh every morning.',
    about: 'Everything is made by hand, early, in small batches. Real butter, real time, and nothing sitting around until tomorrow.',
    servicesTitle: 'From the oven', ctaTitle: 'Come by while it is warm.', ctaText: 'Stop in this morning or order ahead for pickup.',
    services: [['Fresh Bread', 'Naturally leavened loaves baked through the morning.', '1f35e'], ['Pastries', 'Croissants, danishes and the day\'s rotating specials.', '1f950'], ['Cakes', 'Made to order for birthdays and every excuse between.', '1f370'], ['Coffee', 'A proper cup to go with whatever you picked out.', '2615']] };
  if (M(/cafe|coffee|espresso|roaster/)) return {
    category: 'cafe', tagline: 'Your new regular spot.',
    about: 'Good coffee, a calm room and a welcome that makes you want to stay. Whether it is a quick cup or a slow afternoon, you are in the right place.',
    servicesTitle: 'On the menu', ctaTitle: 'See you in the morning.', ctaText: 'Swing by or order ahead and skip the line.',
    services: [['Espresso', 'Pulled fresh from beans we actually care about.', '2615'], ['Pour Over', 'Single-origin coffee brewed slow and clean.', '2615'], ['Pastries', 'A short, fresh case to go with your cup.', '1f950'], ['Cold Brew', 'Smooth, steeped overnight, served over ice.', '1f9ca']] };
  if (M(/restaurant|kitchen|grill|bbq|barbecue|taco|taqueria|cantina|burrito|pizz|sushi|ramen|izakaya|trattoria|diner|eatery|bistro|catering|food truck|cuisine|steakhouse|smokehouse|burger/) && !M(/remodel|renovat|cabinet|countertop/)) return {
    category: 'restaurant', tagline: 'Food worth coming back for.',
    about: 'Honest cooking made from good ingredients, served by people who are glad you came in. Pull up a seat — we saved you one.',
    servicesTitle: 'Why people come back', ctaTitle: 'Hungry yet?', ctaText: 'Reserve a table or order ahead for pickup.',
    services: [['Made to Order', 'Dishes cooked when you order them, never before.', '1f373'], ['Local Ingredients', 'We source close to home whenever the season allows.', '1f33f'], ['Full Menu', 'Something for everyone, from the regulars to the curious.', '1f37d'], ['Takeout', 'The same kitchen, packed up and ready to go.', '1f963']] };
  if (M(/lawn|landscap|garden|yard|turf|mow|tree service|irrigation/)) return {
    category: 'lawn', tagline: 'The best yard on the block.',
    about: 'We show up when we say we will and treat your yard like it is ours. Dependable work, fair prices, and a lawn you are proud of.',
    servicesTitle: 'What we handle', ctaTitle: 'Want a tidier yard?', ctaText: 'Tell us about your property and we will send a quote.',
    services: [['Mowing', 'Clean, even cuts on a schedule that fits your yard.', '1f33e'], ['Landscaping', 'Beds, plantings and features that lift the whole property.', '1fab4'], ['Cleanups', 'Seasonal leaf, brush and debris hauled away for good.', '1f342'], ['Trimming', 'Hedges, edges and trees kept sharp and healthy.', '1f333']] };
  if (M(/clean|maid|janitor|housekeep|pressure wash|window wash/) && !M(/\bcar\b|auto|vehicle|dry clean/)) return {
    category: 'cleaning', tagline: 'Come home to spotless.',
    about: 'Thorough, reliable cleaning from a team you can trust in your space. We sweat the corners so you never have to think about them.',
    servicesTitle: 'What we clean', ctaTitle: 'Ready for a cleaner place?', ctaText: 'Tell us the size of the job and we will quote it fast.',
    services: [['Deep Clean', 'Top to bottom, the one that resets the whole place.', '2728'], ['Recurring', 'Weekly or monthly visits that keep it effortless.', '1f4c5'], ['Move In / Out', 'Empty-home cleans that get the deposit back.', '1f4e6'], ['Windows', 'Streak-free glass, inside and out.', '1fa9f']] };
  if (M(/boat|marine|yacht|watercraft|pontoon|dealer.*boat|boat.*dealer|outboard/)) return {
    category: 'marine', tagline: 'Get out on the water.',
    about: 'New and used boats, straight talk, and a crew that actually boats. We will help you find the right one and keep it running for years.',
    servicesTitle: 'What we offer', ctaTitle: 'Ready to find your boat?', ctaText: 'Tell us how you like to spend time on the water and we will point you right.',
    services: [['Boat Sales', 'New and pre-owned boats matched to how you plan to use them.', '1f6a4'], ['Service & Repair', 'Factory-trained techs to keep you off the dock and on the water.', '1f527'], ['Parts & Rigging', 'The right gear, props and electronics, installed properly.', '2699'], ['Storage', 'Keep her covered and ready between trips.', '2693']] };
  if (M(/auto|mechanic|car repair|car ?wash|car clean|detailing|\btires?\b|body shop|collision|automotive|garage/) && !M(/garage door/)) return {
    category: 'auto', tagline: 'Honest work on your ride.',
    about: 'Straightforward diagnostics, fair prices and repairs that last. We tell you what you actually need — and what can wait.',
    servicesTitle: 'What we do', ctaTitle: 'Car acting up?', ctaText: 'Describe what is going on and we will get you scheduled.',
    services: [['Diagnostics', 'We find the real problem before touching a wrench.', '1f50d'], ['Repairs', 'From brakes to belts, done right the first time.', '1f527'], ['Maintenance', 'Oil, fluids and tune-ups to keep it healthy.', '1f6e2'], ['Detailing', 'Inside and out, looking like the day you got it.', '2728']] };
  if (M(/gym|fitness|trainer|crossfit|yoga|pilates|martial|boxing|cycle studio/)) return {
    category: 'fitness', tagline: 'Show up. Get stronger.',
    about: 'A room that pushes you without the ego. Coaches who know your name and a plan that actually fits your life.',
    servicesTitle: 'Train with us', ctaTitle: 'Ready to start?', ctaText: 'Come in for a first session and see if we are your place.',
    services: [['Personal Training', 'One-on-one coaching built around your goals.', '1f4aa'], ['Group Classes', 'High-energy sessions that are easy to stick with.', '1f3cb'], ['Open Gym', 'Your space, your pace, whenever it works.', '1f3cb'], ['Nutrition', 'Simple guidance that makes the training count.', '1f957']] };
  if (M(/photo|videograph|film|cinematograph/)) return {
    category: 'photo', tagline: 'Moments worth keeping.',
    about: 'Natural, unforced images that actually look like you. We make the session easy and the photos something you will treasure.',
    servicesTitle: 'What we shoot', ctaTitle: 'Let us capture it.', ctaText: 'Tell us about your shoot and we will check our dates.',
    services: [['Portraits', 'Relaxed sessions that bring out who you really are.', '1f4f7'], ['Events', 'Weddings and milestones, documented beautifully.', '1f389'], ['Branding', 'Images that make your business look the part.', '1f4bc'], ['Video', 'Short films that hold onto the feeling, not just the look.', '1f3a5']] };
  if (M(/locksmith|lock ?out|lock (?:and|&) key|rekey/)) return {
    category: 'locksmith', tagline: 'Locked out? We can help.',
    about: 'We get you back in carefully, change or rekey your locks, and tell you the price before we start. Homes, cars and businesses.',
    servicesTitle: 'Services', ctaTitle: 'Need a locksmith?', ctaText: 'Call or message us with your location and what happened.',
    services: [['Lockouts', 'Careful entry to homes and cars, without damage where possible.', '1f511'], ['Rekeying', 'Old keys stop working, your locks stay put.', '1f5dd'], ['Lock changes', 'New locks fitted on doors, gates and windows.', '1f512'], ['Key cutting', 'Spare keys cut and tested before you leave.', '1f511']] };
  if (M(/appliance|washer|dryer repair|fridge|refrigerat|dishwasher|oven repair/)) return {
    category: 'appliance', tagline: 'Fix it before you replace it.',
    about: 'We find the fault, tell you what the repair costs and whether it is worth doing, then fix it with the right parts.',
    servicesTitle: 'What we repair', ctaTitle: 'Something broken?', ctaText: 'Tell us the appliance, the brand and what it is doing.',
    services: [['Washers and dryers', 'Leaks, noises, no spin or no heat.', '1f9fa'], ['Refrigerators', 'Not cooling, leaking or icing up.', '1f9ca'], ['Ovens and ranges', 'Burners, elements and temperature problems.', '1f525'], ['Dishwashers', 'Not draining, not cleaning or not starting.', '1f37d']] };
  if (M(/tailor|alteration|seamstress|dressmak/)) return {
    category: 'tailor', tagline: 'Clothes that fit properly.',
    about: 'We take in, let out, hem and repair, so the clothes you already own fit the way they should. Every job starts with a proper fitting.',
    servicesTitle: 'Alterations', ctaTitle: 'Bring it in.', ctaText: 'Book a fitting or stop by during opening hours.',
    services: [['Hemming', 'Pants, skirts, dresses and sleeves taken up neatly.', '1f9f5'], ['Take in or let out', 'Waists, seams and sides adjusted to fit.', '1f4cf'], ['Suits', 'Jackets and pants fitted for a sharp look.', '1f454'], ['Repairs', 'Zippers, tears, buttons and linings fixed.', '2702']] };
  if (M(/daycare|day care|child ?care|nursery school|pre-?school|pre-?k\b|after.?school|nanny|babysit|early learning|montessori/)) return {
    category: 'childcare', tagline: 'A warm place to play and learn.',
    about: 'We give children a safe, caring place to play, explore and learn, with a daily rhythm they can count on and staff who know each child well.',
    servicesTitle: 'Our programs', ctaTitle: 'Come and visit.', ctaText: 'Book a tour and meet the people who would look after your child.',
    services: [['Infant care', 'Gentle, attentive care for the youngest children.', '1f37c'], ['Toddlers', 'Play, songs and first friendships.', '1f9f8'], ['Preschool', 'Early learning that gets children ready for school.', '1f4da'], ['After-school care', 'A safe place to play and do homework.', '1f392']] };
  if (M(/boutique|apparel|clothing|jewelry|retail|store|shop|goods|merch|gift/) && !M(/flower|florist/)) return {
    category: 'retail', tagline: 'Finds you will actually love.',
    about: 'A carefully chosen selection, not a warehouse. Everything here earned its place — come see what we picked out for you.',
    servicesTitle: 'Why shop with us', ctaTitle: 'Come take a look.', ctaText: 'Browse in store or reach out and we will hold something for you.',
    services: [['Curated', 'A tight, thoughtful selection you can trust.', '1f6cd'], ['Local', 'Owned and run by people who live here too.', '1f4cd'], ['Personal', 'Real help from people who know the stock.', '1f91d'], ['Quality', 'Pieces chosen to last, not just to sell.', '2728']] };
  if (M(/handy|plumb|electric|hvac|heating|air condition|furnace|roof|pest|pool|gutter|contractor|remodel|renovat|fence|deck|construction|paint|flooring|drywall|siding|garage door|cabinet|countertop/)) return {
    category: 'home', tagline: 'Done right, done once.',
    about: 'Licensed, tidy and on time. We treat your home with respect and leave it better than we found it — no surprises on the bill.',
    servicesTitle: 'What we handle', ctaTitle: 'Got a project?', ctaText: 'Describe the job and we will get you a straight quote.',
    services: [['Free Estimates', 'A clear, honest number before any work begins.', '1f4cb'], ['Quality Work', 'Craftsmanship that holds up for years, not months.', '1f528'], ['On Schedule', 'We show up when we say and finish when we promise.', '23f0'], ['Guaranteed', 'We stand behind the work, plain and simple.', '2705']] };
  // Generic local business — a fitting tagline and about, but no invented service list.
  if (M(/\blaw\b|lawyer|attorney|legal|notary|paralegal/)) return {
    category: 'legal', tagline: 'Clear advice when it matters most.',
    about: 'We explain your options in plain English, give you an honest read on where you stand, and stay in your corner from the first call to the final signature.',
    servicesTitle: 'How we can help', ctaTitle: 'Talk it through with us.', ctaText: 'Book a consultation and get a straight answer on your next step.',
    services: [['Consultations', 'A focused first meeting to understand your situation and your options.', '1f4ac'], ['Documents & contracts', 'Drafted, reviewed and explained so you know exactly what you are signing.', '1f4dd'], ['Representation', 'Prepared, persistent advocacy when you need someone on your side.', '2696'], ['Ongoing counsel', 'A trusted contact for questions as they come up.', '1f91d']] };
  if (M(/dent|orthodon|endodon|periodon/)) return {
    category: 'dental', tagline: 'Gentle care for healthy smiles.',
    about: 'We keep visits calm, explain everything before we start, and build a plan around your comfort and your budget.',
    servicesTitle: 'Our care', ctaTitle: 'Due for a visit?', ctaText: 'Request an appointment and we will find a time that suits you.',
    services: [['Cleanings & checkups', 'Thorough, gentle cleanings and a clear picture of your oral health.', '1fa65'], ['Fillings & repairs', 'Comfortable, natural-looking repairs that last.', '1f9b7'], ['Whitening', 'A brighter smile with safe, professional whitening.', '2728'], ['Urgent visits', 'Toothache or a chip? Call us and we will fit you in.', '1f6a8']] };
  if (M(/doctor|clinic|medical|chiro|physio|physical therap|therapist|counsel|optometr|pediatric|wellness|acupunct|nutrition|dermatolog/)) return {
    category: 'health', tagline: 'Care that listens first.',
    about: 'You are more than a chart. We take the time to understand what is going on and work with you on a plan that fits your life.',
    servicesTitle: 'How we help', ctaTitle: 'Feel better, sooner.', ctaText: 'Request an appointment and we will be in touch to confirm.',
    services: [['New patient visits', 'An unhurried first visit to understand your history and goals.', '1f44b'], ['Personalized care', 'Treatment shaped around you, explained every step of the way.', '1fa7a'], ['Follow-up support', 'Check-ins that keep your progress on track.', '1f4c5']] };
  if (M(/account|bookkeep|\btax|\bcpa\b|financ|insurance|mortgage|invest|wealth|payroll/)) return {
    category: 'finance', tagline: 'Numbers you can stop worrying about.',
    about: 'We keep your finances organized, on time and easy to understand, so you can focus on everything else.',
    servicesTitle: 'Services', ctaTitle: 'Let us take this off your plate.', ctaText: 'Book a free call and we will map out what you need.',
    services: [['Tax preparation', 'Accurate, on-time filing with every deduction you are owed.', '1f4c4'], ['Bookkeeping', 'Clean monthly books and reports you can actually read.', '1f4ca'], ['Planning', 'Clear advice on what is next for your money.', '1f4c8'], ['Year-round support', 'Questions answered whenever they come up, not just in April.', '1f4ac']] };
  if (M(/real ?estate|realtor|realty|property manag|\bbroker/)) return {
    category: 'realestate', tagline: 'The right move, made simple.',
    about: 'We know this market street by street. Whether you are buying, selling or just curious, you get honest advice and someone who answers the phone.',
    servicesTitle: 'How we help', ctaTitle: 'Thinking about a move?', ctaText: 'Tell us what you are looking for and we will take it from there.',
    services: [['Buying', 'Find the right place and negotiate a fair price with confidence.', '1f3e1'], ['Selling', 'Smart pricing, great marketing and a smooth closing.', '1f511'], ['Home valuations', 'A free, honest estimate of what your home is worth today.', '1f4cf'], ['Relocation', 'New to the area? We will help you find your neighborhood.', '1f69a']] };
  if (M(/tutor|lesson|teach|school|academy|music|piano|guitar|violin|language|driving|course|class/)) return {
    category: 'education', tagline: 'Learning that actually sticks.',
    about: 'We meet every student where they are, set clear goals, and make the progress visible, so confidence grows along with skill.',
    servicesTitle: 'Lessons', ctaTitle: 'Ready to get started?', ctaText: 'Book a first session and we will build a plan together.',
    services: [['Private lessons', 'One-on-one sessions shaped around your goals and pace.', '1f4da'], ['Small groups', 'Learn alongside others in a focused, friendly setting.', '1f465'], ['Exam prep', 'Targeted practice and strategy for the big day.', '1f4dd'], ['Online sessions', 'The same great teaching from wherever you are.', '1f4bb']] };
  if (M(/wedding|event|planner|florist|flower|\bdj\b|party|decor/)) return {
    category: 'events', tagline: 'Your day, beautifully handled.',
    about: 'We sweat the details so you do not have to. From the first idea to the last dance, every piece comes together the way you pictured it.',
    servicesTitle: 'What we do', ctaTitle: 'Let us plan something great.', ctaText: 'Tell us your date and ideas and we will be in touch.',
    services: [['Full planning', 'From budget to timeline, we handle it all.', '1f4cb'], ['Day-of coordination', 'You enjoy the day while we run the show.', '1f4c5'], ['Styling & florals', 'A look that feels like you, down to the table settings.', '1f490'], ['Vendor sourcing', 'Trusted partners for every part of your event.', '1f91d']] };
  if (M(/moving|movers|relocat|storage|junk|haul/)) return {
    category: 'moving', tagline: 'Moving day, minus the stress.',
    about: 'Careful hands, honest prices and a crew that shows up on time. We treat your things like they are our own.',
    servicesTitle: 'Services', ctaTitle: 'Planning a move?', ctaText: 'Get a free quote and lock in your date.',
    services: [['Local moves', 'Fast, careful moves across town.', '1f69a'], ['Packing', 'We pack it right so it arrives in one piece.', '1f4e6'], ['Junk removal', 'Clear out what you no longer need.', '1f5d1'], ['Storage', 'Safe, secure space for whatever does not fit yet.', '1f3e2']] };
  if (M(/consult|agency|marketing|design|developer|software|\bweb\b|it services|tech|creative|branding|copywrit/)) return {
    category: 'studio', tagline: 'Good work, done properly.',
    about: 'We are a small, senior team that listens carefully, communicates clearly and delivers work we are proud to put our name on.',
    servicesTitle: 'What we do', ctaTitle: 'Have a project in mind?', ctaText: 'Tell us about it and we will reply with next steps.',
    services: [['Strategy', 'A clear plan built around your goals and your customers.', '1f9ed'], ['Design', 'Thoughtful, polished work that looks the part.', '1f3a8'], ['Build & launch', 'We ship it, test it and make sure it works.', '1f680'], ['Ongoing support', 'Still here after launch, whenever you need us.', '1f4ac']] };
  return {
    category: 'generic', tagline: 'Proud to serve our community.',
    about: 'We are a local business built on doing right by our neighbors — dependable service, fair prices, and people who care how it turns out.',
    servicesTitle: 'What we do', ctaTitle: "Let's get started.", ctaText: "Reach out and we'll take it from here.", services: [['Friendly service', 'Straightforward help from people who care about getting it right.', '1f91d'], ['Tailored to you', 'We listen first, then shape the work around what you need.', '2728'], ['Here when you need us', 'Questions after the job? We are one message away.', '1f4ac']] };
}

// Per-category default palette + a few editable FAQ entries (generic, never fabricated specifics).
// Copy variation pools — one line is picked at random per site so two businesses in the same
// category never read identically. The base v3StarterBase value is kept as the first option.
// Copy pools live in 49-copy.js (V3_COPYBOOK, refined by V3_SUBTYPES).
const V3_FLAVORS = V3_COPYBOOK;
// Seeded randomness: every copy and layout pick goes through v3Rand. buildV3Site seeds it from the business
// (name, type, city) around each synchronous step, so regenerating the same business gives the same site and
// two businesses of the same type still look different. Outside a seeded step it is plain Math.random.
let V3_RNG = Math.random;
function v3Rand() { return V3_RNG(); }
function v3Seeded(seed) { let a = parseInt(v3Hash(seed), 36) >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function v3WithSeed(seed, fn) { const prev = V3_RNG; V3_RNG = v3Seeded(seed); try { return fn(); } finally { V3_RNG = prev; } }
function v3FlavorPick(arr) { return (arr && arr.length) ? arr[Math.floor(v3Rand() * arr.length)] : ''; }

// Business families: decide the page recipe, the main action and the CTA voice.
const V3_FAMILY = {
  restaurant: 'food', cafe: 'food', bakery: 'food',
  lawn: 'trades', cleaning: 'trades', home: 'trades', moving: 'trades', locksmith: 'trades', appliance: 'trades', auto: 'trades',
  barber: 'beauty', salon: 'beauty', spa: 'beauty', tattoo: 'beauty', fitness: 'beauty', pet: 'beauty', tailor: 'beauty',
  legal: 'pro', finance: 'pro', realestate: 'pro', dental: 'pro', health: 'pro', studio: 'pro', education: 'pro', childcare: 'pro', generic: 'pro',
  photo: 'creative', events: 'creative', retail: 'retail', marine: 'retail',
};
const V3_DRINKS_RE = /\bbar\b|\bpub\b|brewery|brewpub|winery|taproom|tavern|\bdeli\b|juice|smoothie|ice cream|gelato|creamery|bubble tea|boba|tea ?house|tea room|frozen yogurt/;
function v3Family(cat, type) { return (cat === 'generic' && V3_DRINKS_RE.test(String(type || '').toLowerCase())) ? 'food' : (V3_FAMILY[cat] || 'pro'); }
// The one thing each kind of business wants a visitor to do. Booking-form variant, page path, nav name,
// header button, page heading, main button, form intro, thank-you line, CTA copy kind. A null variant means
// no request page: the button goes to the Contact page (visit us / get in touch) or the shop.
const V3_ACTIONS = {
  reserve: ['reservation', 'reserve', 'Reserve', 'Reserve', 'Reserve a table', 'Reserve a table', 'Tell us when you’d like to come and how many of you there are, and we’ll confirm your table.', 'Thanks. Your request is in and we’ll confirm your table shortly.', 'food'],
  order: ['order', 'order', 'Order', 'Order', 'Order ahead', 'Order ahead', 'Tell us what you’d like and when you’ll pick it up, and we’ll confirm your order.', 'Thanks. We’ll confirm your order shortly.', 'order'],
  flowers: ['order', 'order', 'Order', 'Order', 'Order flowers', 'Order flowers', 'Tell us the occasion, the date and roughly what you’d like to spend, and we’ll confirm the details.', 'Thanks. We’ll be in touch to confirm your order.', 'order'],
  truck: ['quote', 'quote', 'Book the Truck', 'Book us', 'Book the truck', 'Book the truck', 'Tell us the date, the place and roughly how many guests, and we’ll send a quote.', 'Thanks. We’ll check the date and send you a quote soon.', 'truck'],
  cater: ['quote', 'quote', 'Get a Quote', 'Quote', 'Plan your catering', 'Request a quote', 'Tell us the date, the number of guests and the kind of food you have in mind.', 'Thanks. We’ll look at the details and send you a quote soon.', 'truck'],
  quote: ['quote', 'quote', 'Get a Quote', 'Quote', 'Get a quote', 'Get a quote', 'Tell us about the job and we’ll send you a clear price.', 'Thanks. We’ll look at the details and send you a quote soon.', 'onsite'],
  estimate: ['quote', 'quote', 'Estimate', 'Estimate', 'Request an estimate', 'Request an estimate', 'Tell us about the project, with photos if you have them, and we’ll arrange an estimate.', 'Thanks. We’ll be in touch to arrange your estimate.', 'onsite'],
  service: ['appointment', 'book', 'Schedule', 'Schedule', 'Schedule a visit', 'Schedule a visit', 'Tell us what’s going on and when suits you, and we’ll confirm a time.', 'Thanks. We’ll confirm your visit shortly.', 'onsite'],
  garage: ['appointment', 'book', 'Book', 'Book', 'Book a service', 'Book a service', 'Tell us about your car and when suits you, and we’ll confirm a time.', 'Thanks. We’ll confirm your booking shortly.', 'onsite'],
  inquire: ['quote', 'quote', 'Inquire', 'Inquire', 'Ask about a boat', 'Send an inquiry', 'Tell us what you’re looking for, or what your boat needs, and we’ll get back to you.', 'Thanks. We’ll get back to you soon.', 'onsite'],
  appt: ['appointment', 'book', 'Book', 'Book', 'Book an appointment', 'Book an appointment', 'Choose a time that suits you and we’ll confirm by text or email.', 'Thanks. We’ll confirm your appointment shortly.', 'visit'],
  klass: ['appointment', 'book', 'Book', 'Book', 'Book a class', 'Book a class', 'Pick a class and a time, and we’ll confirm your place.', 'Thanks. We’ll confirm your place shortly.', 'klass'],
  lesson: ['appointment', 'book', 'Book', 'Book', 'Book a first lesson', 'Book a first lesson', 'Tell us about the student and when suits you, and we’ll confirm a time.', 'Thanks. We’ll be in touch to confirm your lesson.', 'learn'],
  tour: ['appointment', 'book', 'Book a Tour', 'Book a tour', 'Book a tour', 'Book a tour', 'Choose a day and time to visit, meet the team and see the rooms.', 'Thanks. We’ll be in touch to confirm your tour.', 'tour'],
  patient: ['appointment', 'book', 'Appointments', 'Book', 'Request an appointment', 'Request an appointment', 'Tell us when suits you and we’ll be in touch to confirm.', 'Thanks. We’ll be in touch to confirm your appointment.', 'visit'],
  consult: ['appointment', 'book', 'Consultation', 'Consult', 'Book a consultation', 'Book a consultation', 'Tell us a little about your situation and when suits you, and we’ll confirm a time.', 'Thanks. We’ll be in touch to confirm your consultation.', 'project'],
  call: ['appointment', 'book', 'Book a Call', 'Book a call', 'Book a call', 'Book a call', 'Choose a time that suits you and we’ll call you then.', 'Thanks. We’ll confirm your call shortly.', 'project'],
  project: ['quote', 'quote', 'Start a Project', 'Start', 'Tell us about your project', 'Start a project', 'Share what you have in mind, however rough, and we’ll reply with next steps.', 'Thanks. We’ll read it carefully and reply with next steps.', 'project'],
  avail: ['appointment', 'book', 'Availability', 'Check dates', 'Check availability', 'Check availability', 'Tell us your date and what you have in mind, and we’ll let you know if we’re free.', 'Thanks. We’ll check the date and get back to you.', 'project'],
  visitus: [null, '', '', 'Visit', '', 'Visit us', '', '', 'drop'],
  contact: [null, '', '', 'Contact', '', 'Get in touch', '', '', 'contact'],
};
// Which action fits the business, from its category and the words the owner typed. [action, main button override]
function v3ActionFor(cat, type, fam) {
  const t = String(type || '').toLowerCase();
  const M = (re) => re.test(t);
  switch (cat) {
    case 'restaurant': return M(/food truck|street food/) ? ['truck'] : M(/cater/) ? ['cater'] : M(/pizz|bbq|barbecue|smokehouse|taco|taqueria|burrito|burger|diner|sandwich|take-?out|fast food|chicken|wings|hot dog|poke|noodle bar/) ? ['order'] : ['reserve'];
    case 'bakery': return ['order'];
    case 'cafe': return ['visitus'];
    case 'lawn': return M(/landscap|design|irrigation|tree service|hardscap/) ? ['estimate'] : ['quote'];
    case 'cleaning': case 'moving': case 'locksmith': return ['quote'];
    case 'appliance': return ['service'];
    case 'home': return M(/plumb|electric|hvac|heating|air condition|furnace|cooling|pest|pool|garage door/) ? ['service'] : M(/roof|remodel|renovat|construction|contractor|builder|paint|floor|fence|deck|siding|cabinet|countertop|drywall/) ? ['estimate'] : ['quote'];
    case 'auto': return M(/car ?wash|hand wash/) ? ['visitus'] : M(/body shop|collision|\bdent/) ? ['estimate', 'Request an estimate'] : M(/detail/) ? ['garage', 'Book a detail'] : ['garage'];
    case 'marine': return ['inquire'];
    case 'barber': return ['appt', 'Book a cut'];
    case 'salon': return ['appt'];
    case 'spa': return M(/massage/) ? ['appt', 'Book a massage'] : M(/nail|lash|brow|wax/) ? ['appt'] : ['appt', 'Book a treatment'];
    case 'tattoo': return ['consult'];
    case 'fitness': return M(/yoga|pilates|barre|spin|cycle|dance|martial|karate|jiu|bjj|taekwondo|judo|boxing|mma|kickbox/) ? ['klass'] : ['appt', 'Book a first session'];
    case 'pet': return M(/\bvet|veterinar|animal hospital/) ? ['patient'] : M(/groom/) ? ['appt', 'Book a groom'] : M(/walk/) ? ['appt', 'Book a walk'] : M(/train/) ? ['appt', 'Book a session'] : M(/board|kennel|daycare|sitt/) ? ['appt', 'Book a stay'] : ['appt', 'Book a visit'];
    case 'tailor': return ['appt', 'Book a fitting'];
    case 'legal': return ['consult'];
    case 'finance': case 'realestate': return ['call'];
    case 'dental': return ['patient'];
    case 'health': return M(/counsel|therap|psycholog|mental/) && !M(/physical|massage/) ? ['consult', 'Book a first session'] : ['patient'];
    case 'studio': return ['project'];
    case 'education': return M(/tutor/) ? ['lesson', 'Book a session'] : ['lesson'];
    case 'childcare': return ['tour'];
    case 'photo': return ['avail'];
    case 'events': return M(/florist|flower/) ? ['flowers'] : ['avail'];
    case 'retail': return ['visitus'];
  }
  return [fam === 'food' ? 'visitus' : 'contact'];
}
// What the main page (and its nav entry) is called.
function v3MainLabel(cat, type, fam, isShop) {
  const t = String(type || '').toLowerCase();
  if (isShop) return 'Shop';
  if (fam === 'food') return 'Menu';
  if (cat === 'spa') return /nail|lash|brow|wax/.test(t) ? 'Services' : 'Treatments';
  if (cat === 'fitness') return /yoga|pilates|barre|spin|cycle|dance|martial|karate|jiu|bjj|taekwondo|judo|boxing|mma|kickbox/.test(t) ? 'Classes' : 'Training';
  return ({ education: /tutor/.test(t) ? 'Tutoring' : 'Lessons', childcare: 'Programs', legal: 'Practice Areas', tailor: 'Alterations', dental: 'Treatments', retail: 'In Store', events: /florist|flower/.test(t) ? 'Flowers' : 'Services' })[cat] || 'Services';
}
// Everything a site needs to label itself coherently: header button, hero/CTA buttons, nav and page names.
function v3Labels(cat, type, isShop) {
  const fam = isShop ? 'retail' : v3Family(cat, type);
  const pick = isShop ? ['shop'] : v3ActionFor(cat, type, fam);
  const a = V3_ACTIONS[pick[0]] || null;
  const main = v3MainLabel(cat, type, fam, isShop);
  const out = { family: (fam === 'trades' && pick[0] === 'visitus') ? 'retail' : fam, act: pick[0], main: main, mainPath: main.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), bk: null };
  if (isShop) return Object.assign(out, { bookLabel: 'Shop now', bookShort: 'Shop', ctaKind: 'shop' });
  out.bookLabel = pick[1] || a[5];
  out.bookShort = a[3];
  out.ctaKind = (pick[0] === 'visitus' && fam === 'food') ? 'cafe' : a[8];
  if (a[0]) out.bk = { mode: a[0], path: a[1], title: a[2], short: a[3], head: pick[1] || a[4], btn: out.bookLabel, sub: a[6], ok: a[7] };
  return out;
}

// Structural copy pools used across every generated site (steps, page CTAs, pageheads, forms).
// These are the lines that used to be identical on every site — now each one is picked fresh.
const V3_COPY = {
  featured: ['Popular right now', 'A few favorites', 'Customer favorites', 'Where to start', 'Most requested', 'Our most popular'],
  whatWeDo: ['What we do', 'What we offer', 'How we can help', 'Ways we can help'],
  // Home teaser titles for places whose own titles just say "Menu" (the main page already carries that name).
  menuTeaser: { restaurant: ['On the menu', 'What we’re known for', 'From the kitchen', 'House favorites'], cafe: ['On the menu', 'What we’re known for', 'Behind the counter'] },
  teamTitle: ['Meet the team', 'The team', 'Who you’ll meet'],
  faqTitle: ['Quick answers', 'Good to know', 'Common questions'],
  stepsTitle: ['How it works', 'What to expect', 'Getting started', 'How we work', 'From first message to finished', 'Simple from start to finish'],
  stepsSets: [
    [['Get in touch', 'Tell us what you need and when suits you.'], ['Get a clear plan', 'We confirm the details and give you an honest price.'], ['Consider it done', 'We do the work and check you’re happy with it.']],
    [['Tell us your goal', 'Share what you’re after. No detail is too small.'], ['We plan it together', 'A clear plan and price, with no surprises later.'], ['We get to work', 'You’ll hear from us at every stage until it’s finished.']],
    [['Start with a conversation', 'A quick call or message is all it takes.'], ['Agree the details', 'We listen, ask good questions and propose a plan.'], ['See it through', 'We deliver what we agreed, when we said we would.']],
  ],
  shopCta: { title: ['Ready to order?', 'Found something you like?', 'Shop the full range.', 'Ready to check out?'], text: ['Add your favorites to the cart and check out in a minute.', 'Checkout is quick, and we’ll confirm your order by email.', 'Have a question about a product? Send us a message before you order.'] },
  // Calls to action that fit the kind of business: somewhere you eat, somewhere you visit, someone who comes
  // to you, or a professional service.
  pageCta: {
    food: { title: ['Hungry yet?', 'Join us soon.', 'Book a table.', 'Come and eat with us.'], text: ['Reserve a table, or call us with any questions.', 'Book online, call us, or just walk in.', 'Planning a group meal? Get in touch and we’ll help you arrange it.'] },
    visit: { title: ['Book your visit.', 'Ready when you are.', 'Find a time that suits you.', 'Come and see us.', 'Book your appointment.'], text: ['Choose a time online, or call us and we’ll find one together.', 'Book ahead to get the time you want.', 'Not sure what to book? Send us a message and we’ll help you choose.'] },
    onsite: { title: ['Get a quote.', 'Tell us about the job.', 'Need a hand?', 'Book a visit.', 'Let’s get it sorted.'], text: ['Send a few details, and photos if you have them, and we’ll reply with a clear price.', 'Tell us what you need and when, and we’ll arrange the rest.', 'Get in touch for a no-obligation quote.'] },
    project: { title: ['Let’s talk.', 'Have a question?', 'Get in touch.', 'Start the conversation.'], text: ['Tell us a little about what you need and we’ll suggest the next steps.', 'Book a short call and we’ll talk through your options.', 'Send us a message. We usually reply within one business day.'] },
    order: { title: ['Order ahead.', 'Planning something?', 'Get your order in.', 'Something for the weekend?'], text: ['Tell us what you’d like and when you’ll pick it up, and we’ll have it ready.', 'Larger orders need a little notice. Get in touch and we’ll help you plan.', 'Order ahead for pickup, or stop by and see what’s fresh today.'] },
    truck: { title: ['Planning an event?', 'Feeding a crowd?', 'Bring us to your event.'], text: ['Tell us the date, the place and roughly how many guests, and we’ll send a quote.', 'Parties, offices and private events: get in touch and we’ll plan the menu with you.'] },
    cafe: { title: ['Come in for a coffee.', 'See you soon.', 'Stop by.', 'Pull up a chair.'], text: ['Stop by for a quick cup, or stay a while.', 'Come in and say hello. Questions? Send us a message.', 'Find a seat and make yourself at home.'] },
    drop: { title: ['Come and see us.', 'Stop by.', 'Visit us soon.'], text: ['Stop by during opening hours, or send us a message with any questions.', 'Have a question first? Call or message us.'] },
    klass: { title: ['Try a class.', 'Ready to start?', 'Find a class that suits you.'], text: ['Pick a class and a time, and we’ll confirm your place.', 'New here? Tell us where you’re starting from and we’ll suggest a class.'] },
    learn: { title: ['Book a first lesson.', 'Ready to start?', 'Let’s make a plan.'], text: ['Tell us about the student and their goals, and we’ll suggest the right lessons.', 'Get in touch to check availability and times.'] },
    tour: { title: ['Come and visit.', 'Book a tour.', 'See the rooms for yourself.'], text: ['Book a tour and meet the people who would look after your child.', 'Ask about availability and we’ll walk you through how enrollment works.'] },
    contact: { title: ['Get in touch.', 'How can we help?', 'Talk to us.'], text: ['Send us a message and we’ll get back to you soon.', 'Call or message us with any questions.'] },
  },
  aboutCtaBy: {
    food: { title: ['Come and visit.', 'See you soon.', 'Pull up a chair.', 'Join us for a meal.'], text: ['We’d love to cook for you. Book a table or just drop in.', 'Have a question about the menu or a booking? Get in touch.', 'Find us, or book a table for your next visit.'] },
    visit: { title: ['Come and meet us.', 'We’d love to see you.', 'Say hello.', 'Book your first visit.'], text: ['Book a visit, or send us a message with any questions first.', 'New here? Tell us what you’re looking for and we’ll help you choose.', 'Call, message or stop by. We’re happy to help.'] },
    onsite: { title: ['Let’s work together.', 'Ready when you are.', 'Talk to us.', 'Get a quote.'], text: ['Tell us about your job and we’ll get back to you with a clear price.', 'Questions before you book? We’re a message away.', 'Send us a few details and we’ll take it from there.'] },
    project: { title: ['Let’s work together.', 'Talk to us.', 'Get in touch.', 'Questions? Just ask.'], text: ['Tell us a little about what you need and we’ll explain how we can help.', 'Book a call or send us a message, whichever suits you.', 'We’re happy to answer questions before you commit to anything.'] },
  },
  serviceCta: { title: ['Ready to get started?', 'Let’s talk about what you need.', 'Have a question?', 'Book with us.', 'Get in touch today.'], text: ['Book a time or send us a message, and we’ll take it from there.', 'Tell us what you need and we’ll get back to you with next steps.', 'Message us with any questions. We’re happy to help you choose.'] },
  aboutCta: { title: ['Let’s work together.', 'We’d love to hear from you.', 'Come and say hello.', 'Get to know us.', 'Questions? Just ask.'], text: ['Have a question or ready to book? We’re a message away.', 'Tell us a little about what you need and we’ll take it from there.', 'Call, message or stop by. We’re always happy to help.'] },
  contactHead: { title: ['Contact us', 'Get in touch', 'Visit or contact us', 'We’d love to hear from you', 'Say hello'], textCity: ['Find us in CITY.', 'Based in CITY and serving the surrounding area.', 'Proudly local to CITY.', 'Visit us in CITY, or send a message below.'], textNoCity: ['Send us a message and we’ll get back to you soon.', 'Questions, bookings or quotes: we’re happy to help.', 'Call, email or use the form below.'] },
  formTitle: ['Send us a message', 'Get in touch', 'Ask us anything', 'Request a call back', 'How can we help?'],
  formText: ['Leave your details and we’ll get back to you soon.', 'Tell us what you need. We usually reply within one business day.', 'Questions, bookings or quotes: send us a note and we’ll be in touch.', 'Fill in the form below and we’ll reply as soon as we can.'],
  formSuccess: ['Thanks for your message. We’ll be in touch soon.', 'Got it, thank you. We’ll reply as soon as we can.', 'Message sent. We’ll get back to you shortly.', 'Thanks for getting in touch. We’ll reply within one business day.'],
  shopHead: ['Browse the full range and order online.', 'Everything we stock, in one place.', 'Order online, or visit us in store.', 'Take your time and have a look around.'],
  menuHead: ['Fresh, seasonal and made in house.', 'Everything on our menu, made to order.', 'Have a look at what we’re cooking.', 'Our full menu, made fresh every day.'],
  servicesHead: ['Everything we offer, at a glance.', 'Find the right service for you.', 'Here’s how we can help.', 'Not sure what you need? Ask us.'],
};
const V3_STEPS_BY_KIND = {
  // people come to you (chair, table, studio, gym)
  visit: [
    [['Book a time', 'Choose a time online or give us a call.'], ['Come in and relax', 'We talk it through before we start.'], ['Leave happy', 'You walk out feeling the way you hoped.']],
    [['Choose your appointment', 'Pick a service and a time that suits your week.'], ['Tell us what you like', 'We listen first, then get to work.'], ['Enjoy the result', 'Most of our clients book their next visit before they leave.']],
    [['Get in touch', 'Book online, call, or just stop by.'], ['Make yourself comfortable', 'We’ll look after you from the moment you arrive.'], ['See you next time', 'We’ll remember how you like it.']],
  ],
  // you go to them (lawn, cleaning, trades)
  onsite: [
    [['Ask for a quote', 'Tell us about the job and we’ll send a clear price.'], ['Choose a date', 'We work around your schedule.'], ['Job done', 'We finish properly, tidy up and check you’re happy.']],
    [['Tell us what you need', 'A quick message or call, with photos if you have them.'], ['We plan the work', 'A straight answer on price and timing.'], ['We get it done', 'Quality work, finished when we said it would be.']],
    [['Book a visit', 'We’ll come and take a look if the job needs it.'], ['Agree the price', 'You approve the quote before any work begins.'], ['Sit back', 'We handle everything and keep you updated.']],
  ],
  // projects and professional services
  project: V3_COPY.stepsSets.slice(0, 3),
  // clinics and practices
  care: [
    [['Request an appointment', 'Choose a time online or give us a call.'], ['Talk it through', 'We listen first and explain what we find before any treatment.'], ['A clear plan', 'You leave knowing your options and what comes next.']],
    [['Get in touch', 'Call or send a request, and tell us if anything is urgent.'], ['Your first visit', 'Unhurried, with time for your questions.'], ['Follow-up', 'We check in and adjust the plan as you go.']],
  ],
  // lessons and tutoring
  learn: [
    [['Get in touch', 'Tell us about the student, their level and their goals.'], ['A first session', 'A relaxed start so we can see where things are.'], ['Build from there', 'A clear plan, with progress you can see.']],
    [['Tell us the goal', 'An exam, a new skill or more confidence: we start there.'], ['Find a regular time', 'Lessons that fit around school and work.'], ['Keep going', 'We review progress together and adjust as you improve.']],
  ],
  // childcare
  tour: [
    [['Book a tour', 'Visit, meet the staff and see the rooms.'], ['Ask your questions', 'We explain the daily routine, meals and how enrollment works.'], ['Settle in', 'A gentle start so your child feels at home.']],
  ],
};
// "Colorful" look: richer two-color themes that suit each category.
const V3_COLORFUL = {
  barber: ['royal', 'midnight', 'graphite'], salon: ['blush', 'plum', 'linen'], spa: ['sage', 'mint', 'harbor'],
  tattoo: ['oxblood', 'graphite', 'ember'], bakery: ['butter', 'blush', 'citrus'], cafe: ['espresso', 'desert', 'butter'],
  restaurant: ['ember', 'oxblood', 'citrus'], lawn: ['forest', 'sage', 'bottle'], cleaning: ['sky', 'mint', 'harbor'],
  marine: ['harbor', 'sky', 'midnight'], auto: ['graphite', 'ember', 'royal'], fitness: ['ember', 'royal', 'graphite'],
  pet: ['mint', 'sky', 'citrus'], photo: ['concrete', 'plum', 'midnight'], retail: ['blush', 'citrus', 'plum'],
  home: ['concrete', 'slate', 'desert'], generic: ['royal', 'sky', 'citrus'], legal: ['midnight', 'bottle', 'slate'],
  dental: ['sky', 'mint', 'harbor'], health: ['sage', 'mint', 'sky'], finance: ['midnight', 'bottle', 'royal'],
  realestate: ['desert', 'bottle', 'linen'], education: ['royal', 'citrus', 'sky'], events: ['blush', 'plum', 'butter'],
  moving: ['sky', 'citrus', 'ember'], studio: ['ember', 'plum', 'royal'], locksmith: ['graphite', 'butter', 'midnight'],
  appliance: ['sky', 'harbor', 'graphite'], tailor: ['linen', 'plum', 'espresso'], childcare: ['citrus', 'sky', 'mint'],
};
function v3StepsKind(cat) {
  if (cat === 'dental' || cat === 'health') return 'care';
  if (cat === 'education') return 'learn';
  if (cat === 'childcare') return 'tour';
  if (['barber', 'salon', 'spa', 'tattoo', 'fitness', 'pet', 'tailor'].indexOf(cat) > -1) return 'visit';
  if (['lawn', 'cleaning', 'home', 'moving', 'locksmith', 'appliance'].indexOf(cat) > -1) return 'onsite';
  return 'project';
}
function v3StepsItems(cat) { const sets = V3_STEPS_BY_KIND[v3StepsKind(cat || '')] || V3_COPY.stepsSets; const set = v3FlavorPick(sets) || sets[0]; return set.map((x) => ({ name: x[0], text: x[1] })); }
function v3Pick(arr) { return arr[Math.floor(v3Rand() * arr.length)]; }

function v3Starter(type, cred) {
  const r = v3StarterBase(type);
  // Each site draws its own mix from the copy book: the category's pools, refined by sub-type (pizza, plumber...).
  const C = v3CopyFor(type, r.category);
  if (C.tagline) r.tagline = v3FlavorPick(C.tagline) || r.tagline;
  if (C.about) { r.about = v3FlavorPick(C.about) || r.about; r.aboutPool = C.about; }
  if (C.ctaTitle) r.ctaTitle = v3FlavorPick(C.ctaTitle) || r.ctaTitle;
  if (C.ctaText) r.ctaText = v3FlavorPick(C.ctaText) || r.ctaText;
  if (C.servicesTitle) r.servicesTitle = v3FlavorPick(C.servicesTitle) || r.servicesTitle;
  if (C.services && C.services.length) { r.services = v3PickSome(C.services, 4, 2); r.servicePool = C.services; }
  // A sub-type (plumber, electrician...) has a few hand-written searches: one per site, searched first (v3PhotoQueries).
  if (C.photo) { r.photoQuery = Array.isArray(C.photo) ? v3FlavorPick(C.photo) : C.photo; if (C.re) r.photoSub = true; }
  r.taglinePool = C.tagline || [];
  r.servicesTitlePool = C.servicesTitle || [r.servicesTitle];
  // Labels follow what this business actually asks visitors to do (a counter-service taqueria takes orders,
  // a bistro takes reservations), so its CTA and FAQ never promise the other thing.
  const L = v3Labels(r.category, type, false);
  r.labels = L;
  if ((r.category === 'restaurant' && L.act !== 'reserve') || (r.category === 'generic' && L.family === 'food')) { const k = V3_COPY.pageCta[L.ctaKind] || V3_COPY.pageCta.order; r.ctaTitle = v3FlavorPick(k.title); r.ctaText = v3FlavorPick(k.text); }
  // Clean single-accent themes (white + one color). A few fitting options per category → picked at
  // random per site for variety, never a clashing two-hue scheme. Owners can switch to a Noir (black +
  // color) twin or any other theme in the editor.
  const PAL_SETS = {
    barber: ['w_mono', 'w_charcoal', 'w_slate'],
    salon: ['w_rose', 'w_plum', 'w_coffee'],
    spa: ['w_emerald', 'w_teal', 'w_plum'],
    tattoo: ['w_mono', 'w_charcoal', 'w_crimson'],
    bakery: ['w_amber', 'w_rust', 'w_rose'],
    cafe: ['w_coffee', 'w_amber', 'w_rust'],
    restaurant: ['w_rust', 'w_crimson', 'w_coffee'],
    lawn: ['w_emerald', 'w_teal', 'w_slate'],
    cleaning: ['w_ocean', 'w_teal', 'w_indigo'],
    marine: ['w_ocean', 'w_slate', 'w_indigo'],
    auto: ['w_crimson', 'w_charcoal', 'w_mono'],
    fitness: ['w_mono', 'w_crimson', 'w_charcoal'],
    pet: ['w_teal', 'w_emerald', 'w_ocean'],
    photo: ['w_charcoal', 'w_slate', 'w_plum'],
    retail: ['w_plum', 'w_rose', 'w_coffee'],
    home: ['w_slate', 'w_ocean', 'w_charcoal'],
    generic: ['w_indigo', 'w_slate', 'w_ocean'],
    legal: ['w_indigo', 'w_slate', 'w_charcoal'],
    dental: ['w_teal', 'w_ocean', 'w_indigo'],
    health: ['w_teal', 'w_emerald', 'w_ocean'],
    finance: ['w_indigo', 'w_slate', 'w_emerald'],
    realestate: ['w_charcoal', 'w_coffee', 'w_slate'],
    education: ['w_indigo', 'w_amber', 'w_teal'],
    events: ['w_rose', 'w_plum', 'w_coffee'],
    moving: ['w_ocean', 'w_amber', 'w_slate'],
    studio: ['w_mono', 'w_charcoal', 'w_plum'],
    locksmith: ['w_charcoal', 'w_amber', 'w_slate'],
    appliance: ['w_ocean', 'w_slate', 'w_teal'],
    tailor: ['w_coffee', 'w_charcoal', 'w_plum'],
    childcare: ['w_amber', 'w_teal', 'w_rose'],
  };
  // Type themes that suit each category, first one most often: 'bold' (condensed), 'grotesk' (Inter Tight),
  // 'clean' (Plex), 'editorial' (Newsreader), 'refined' (DM Serif), 'classic' (Playfair), 'friendly' (Nunito).
  const TYPE_BY_CAT = {
    barber: ['bold', 'bold', 'grotesk'], tattoo: ['bold', 'grotesk'], auto: ['bold', 'grotesk'], fitness: ['grotesk', 'bold'], marine: ['bold', 'clean'], home: ['grotesk', 'bold', 'clean'],
    salon: ['refined', 'refined', 'editorial'], spa: ['refined', 'editorial', 'clean'], bakery: ['refined', 'editorial', 'friendly'], cafe: ['editorial', 'refined', 'grotesk'], restaurant: ['classic', 'editorial', 'refined'],
    photo: ['editorial', 'grotesk'], retail: ['editorial', 'refined', 'grotesk'], lawn: ['grotesk', 'clean', 'friendly'], cleaning: ['friendly', 'clean', 'grotesk'], pet: ['friendly', 'friendly', 'clean'], generic: ['clean', 'grotesk'],
    legal: ['classic', 'classic', 'editorial'], dental: ['clean', 'friendly'], health: ['clean', 'friendly', 'refined'], finance: ['classic', 'clean'], realestate: ['classic', 'editorial'], education: ['friendly', 'clean'],
    events: ['refined', 'editorial'], moving: ['grotesk', 'bold'], studio: ['grotesk', 'bold', 'clean'], locksmith: ['bold', 'grotesk'], appliance: ['clean', 'grotesk'], tailor: ['editorial', 'refined', 'classic'], childcare: ['friendly', 'friendly', 'clean'],
  };
  const _tt = (typeof WSENGINE !== 'undefined' && WSENGINE.typeThemes) || {};
  const _ts = (TYPE_BY_CAT[r.category] || ['bold', 'clean']).filter((x) => _tt[x]);
  r.typeset = v3FlavorPick(_ts.length ? _ts : ['bold']);
  r.palette = v3FlavorPick(PAL_SETS[r.category] || ['w_mono', 'w_slate', 'w_charcoal']);
  // Now and then use the dark (Noir) twin of the chosen light theme, when it exists.
  try { if (v3Rand() < 0.2) { const _dk = 'b_' + r.palette.slice(2); if (WSENGINE.palettes.some((p) => p.id === _dk)) r.palette = _dk; } } catch (e) {}
  r.faq = v3PickSome((C.faq || V3_COPYBOOK.generic.faq).filter((q) => (L.act === 'reserve' || !/reserv|book a table/i.test(q.join(' '))) && v3CredOk(q[0], cred)), 3, 1);
  return r;
}

// Optional topical hero photography. Reliable + production-grade when env.UNSPLASH_ACCESS_KEY is set
// (free key from unsplash.com/developers). Without a key, or on any error, it returns '' and the site
// falls back to its designed gradient hero — nothing breaks, no latency. Keeps the make-or-break first
// impression photo-led, like the sites small businesses actually admire.
const PHOTO_QUERY = {
  barber: 'barbershop haircut', salon: 'hair salon styling', spa: 'spa wellness treatment', tattoo: 'tattoo studio art',
  bakery: 'artisan bakery bread pastries', cafe: 'cozy coffee shop interior', restaurant: 'restaurant plated food',
  lawn: 'landscaping green lawn garden', cleaning: 'bright clean home interior', marine: 'boat on the water marina',
  auto: 'auto repair garage mechanic', fitness: 'modern gym workout', pet: 'happy dog grooming', photo: 'photographer camera studio',
  retail: 'boutique shop interior', home: 'home renovation craftsmanship', generic: 'local small business storefront',
  locksmith: 'locksmith door lock key', appliance: 'appliance repair technician', tailor: 'tailor sewing alterations', childcare: 'children daycare classroom play'
};
// One Unsplash search → normalized photos, best match first. null = the request failed (no point retrying),
// [] = it worked but found nothing.
// Unsplash's API allows a fixed number of calls per hour. Count every real call in KV and stop at UNSPLASH_HOURLY_CAP
// (default 45): new sites then fall back to the designed gradients instead of failing.
async function unsplashSpend(env) {
  if (!env || !env.KV) return true;
  const cap = parseInt(env.UNSPLASH_HOURLY_CAP, 10); const max = isNaN(cap) || cap < 0 ? 45 : cap;
  try { const k = 'unsplash:budget:' + new Date().toISOString().slice(0, 13); const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= max) return false; await env.KV.put(k, String(n + 1), { expirationTtl: 2 * 3600 }); } catch (e) {}
  return true;
}
async function unsplashSearch(query, env, ms) {
  try {
    if (!env || !env.UNSPLASH_ACCESS_KEY || !query) return null;
    if (!(await unsplashSpend(env))) return null;
    const url = 'https://api.unsplash.com/search/photos?per_page=30&orientation=landscape&content_filter=high&query=' + encodeURIComponent(query);
    const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    const to = ctrl ? setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, ms || 4500) : 0;
    let r;
    try { r = await fetch(url, { headers: { 'Authorization': 'Client-ID ' + env.UNSPLASH_ACCESS_KEY, 'Accept-Version': 'v1' }, signal: ctrl ? ctrl.signal : undefined }); }
    finally { if (to) clearTimeout(to); }
    if (!r || !r.ok) return null;
    const j = await r.json();
    return ((j && j.results) || []).map(function (x) {
      const raw = x && x.urls && (x.urls.regular || x.urls.full || x.urls.raw);
      if (!raw) return null;
      const u = x.user || {};
      // txt: what the photo shows, in words (alt text, description, tags), for the relevance check (v3PhotoScore).
      const txt = [x.alt_description, x.description].concat((Array.isArray(x.tags) ? x.tags : []).map(function (g) { return g && (g.title || g); })).filter(function (v) { return typeof v === 'string'; }).join(' ').toLowerCase().replace(/\s+/g, ' ').slice(0, 500);
      return { id: String(x.id || raw), url: raw + (raw.indexOf('?') > -1 ? '&' : '?') + 'w=1680&q=75&auto=format&fit=crop', name: u.name || 'Unsplash', link: (u.links && u.links.html) || 'https://unsplash.com', download: (x.links && x.links.download_location) || '', txt: txt };
    }).filter(Boolean);
  } catch (e) { return null; }
}
// Search words for this business: the type the owner typed plus its one or two most specific services
// ("vegan bakery sourdough"), so two businesses of the same kind rarely share photos. Vague types
// ("Local business", "Services") use the category's hand-picked search instead, which is also the retry.
const V3_VAGUE_WORD = /^(the|and|of|for|a|an|my|our|local|small|business|businesses|company|companies|co|llc|inc|ltd|service|services|shop|store|group|pro|pros|professional|professionals|best|quality|family|owned|other|misc|general|solutions|center|centre|new|top|expert|experts|specialist|specialists|\d+)$/;
const V3_VAGUE_SERVICE = /^(consult|consults|consultation|consultations|free (estimate|estimates|quote|quotes|consultation)|estimate|estimates|quote|quotes|repair|repairs|maintenance|installation|installations|service|services|other|more|misc|general|custom|package|packages|basic|standard|premium|deluxe|gift card|gift cards|emergency|emergencies|support|appointment|appointments|walk ins?|online|in person|call|contact|help|other services|and more)$/;
function v3Words(x) { return String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\$\s?\d[\d,.]*\+?/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function v3PhotoQueries(biz, sc) {
  const fallback = (sc && (sc.photoQuery || PHOTO_QUERY[sc.category])) || 'local small business storefront';
  const words = v3Words(biz && biz.type).split(' ').filter(function (w) { return w && !V3_VAGUE_WORD.test(w); });
  const type = words.slice(0, 4).join(' ');
  if (type.length < 4) return [fallback];
  let q = type;
  ((biz && biz.services) || []).map(function (s) { return v3Words(s && s.name); })
    .filter(function (n) { return n.length >= 4 && n.split(' ').length <= 3 && !V3_VAGUE_SERVICE.test(n) && (' ' + type + ' ').indexOf(' ' + n + ' ') < 0; })
    .slice(0, 2).forEach(function (n) { if ((q + ' ' + n).split(' ').length <= 6) q += ' ' + n; });
  // Known trades (plumber, electrician, HVAC, roofer...) search their hand-written scene first ("plumber fixing pipe
  // under sink"): a stack of service names finds stranger photos than a clear picture of the work.
  if (sc && sc.photoSub && sc.photoQuery) return q === sc.photoQuery ? [q] : [sc.photoQuery, q];
  return q === fallback ? [q] : [q, fallback];
}
// ── Relevance check for stock photos ──
// Unsplash's search is loose: "plumber" can return an electrician at a panel. Each result's own words (alt text,
// description, tags) are scored: + for words of this business (type, services, its trade's tools), − for another
// trade's tell-tale words or scenes that don't fit (a laptop for a roofer). Photos without words score 0.
const V3_PHOTO_TERMS = [
  [/plumb|drain|sewer|rooter|water heater/, 'plumb pipe sink faucet tap wrench drain toilet leak water heater bathroom'],
  [/electric/, 'electric wiring wire circuit panel breaker outlet socket light switch cable'],
  [/hvac|heating|air condition|furnace|cooling|heat pump/, 'hvac air conditioner conditioning furnace thermostat vent duct heat pump technician unit'],
  [/roof|gutter/, 'roof shingle roofer gutter ladder tiles chimney'],
  [/paint/, 'paint painter brush roller wall'], [/lawn|landscap|mow|garden/, 'lawn grass garden mower yard hedge'],
  [/clean|maid|janitor/, 'clean cleaning mop vacuum spray'], [/locksmith|\block/, 'lock key door'],
];
// [business type, words that mean the photo shows something else]. Skipped when the type itself has the word
// (a pizza bakery may show pizza).
const V3_PHOTO_CONFLICT = [
  [/plumb|drain|sewer|rooter|water heater/, /electric|wiring|\bwires?\b|circuit|breaker|\bfuses?\b|\bpanels?\b|solar|outlet|socket|voltage|\bcables?\b/],
  [/electric/, /\bpipes?\b|plumb|faucet|\bsinks?\b|\btaps?\b|drain|toilet|shower/],
  [/hvac|heating|air condition|furnace|cooling|heat pump/, /plumb|faucet|\bsinks?\b|toilet|solar|circuit|breaker/],
  [/roof|gutter/, /interior|living room|kitchen|bedroom|sofa|couch|bathroom/],
  [/paint/, /\bcanvas\b|artist|gallery|museum/],
  [/lawn|landscap|mow/, /indoor|interior|houseplant|potted/],
  [/clean|maid|janitor/, /dirty|trash|garbage|landfill|pollution/],
  [/restaurant|cafe|coffee|bistro|diner|grill|food|cater|bak|pizz|taco|deli/, /raw meat|butcher|slaughter|carcass|raw chicken/],
  [/bak|pastr|patisserie|bread|donut|cake/, /pizza|burger|steak|sushi/],
  [/pizz/, /sushi|burger|cupcake/],
  [/barber/, /nail polish|manicure/], [/\bnail/, /barber|beard|shave/],
  [/\bdog|\bpet\b|groom/, /\bcats?\b|kitten/],
];
const V3_PHOTO_DESK = /laptop|computer|\boffice\b|\bdesk\b|meeting|smartphone|keyboard|typing|business ?(man|woman)|\bsuit\b/;
const V3_PHOTO_POSE = /portrait|posing|\bposes?\b|selfie|headshot|fashion|\bmodel\b|smiling (man|woman)/;
function v3PhotoRel(biz, sc) {
  const t = String((biz && biz.type) || '').toLowerCase(), terms = {};
  const add = function (w) { w = String(w || ''); if (w.length >= 4 && !V3_VAGUE_WORD.test(w) && !/^(with|under|from|into|over|fixing|repairs?|shop|home|house|room|interior|work|working|local)$/.test(w)) terms[w.length >= 6 ? w.slice(0, 5) : w] = 1; };
  v3Words(t).split(' ').forEach(add);
  v3Words(sc && sc.photoQuery).split(' ').forEach(add);
  ((biz && biz.services) || []).forEach(function (s) { v3Words(s && s.name).split(' ').forEach(add); });
  V3_PHOTO_TERMS.forEach(function (x) { if (x[0].test(t)) x[1].split(' ').forEach(add); });
  return { terms: Object.keys(terms).map(function (w) { return new RegExp('\\b' + w); }), bad: V3_PHOTO_CONFLICT.filter(function (x) { return x[0].test(t) && !x[1].test(t); }).map(function (x) { return x[1]; }), trades: !!(sc && sc.labels && sc.labels.family === 'trades') };
}
function v3PhotoScore(p, rel) {
  const s = (p && p.txt) || '';
  if (!s || !rel) return 0;
  const hit = rel.terms.filter(function (re) { return re.test(s); }).length;
  let n = 2 * Math.min(hit, 4) - 6 * Math.min(rel.bad.filter(function (re) { return re.test(s); }).length, 2);
  if (rel.trades && V3_PHOTO_DESK.test(s)) n -= 4;
  if (rel.trades && !hit && V3_PHOTO_POSE.test(s)) n -= 3;
  return n;
}
// n different photos (never the same one twice). With the relevance check the best-scoring come first: the hero at
// random from the few best matches, the rest at random from the next best. Off-topic photos (score below 0) are
// never used: fewer photos (no gallery, or the designed hero) beat an electrician on a plumber's site.
// Without words to check: the hero from the ~10 most relevant (Unsplash's order), the rest from the next 20.
function v3PickPhotos(list, n, rel) {
  const pool = [], seen = {};
  (list || []).forEach(function (p) { if (p && p.url && !seen[p.id || p.url] && !seen[p.url]) { seen[p.id || p.url] = 1; seen[p.url] = 1; pool.push(p); } });
  const scored = !!rel && pool.some(function (p) { return p.txt; });
  const sc = pool.map(function (p, i) { return { p: p, s: scored ? v3PhotoScore(p, rel) : 0, i: i }; }).filter(function (x) { return x.s >= 0; });
  if (scored) sc.sort(function (a, b) { return b.s - a.s || a.i - b.i; });
  const best = sc.length ? sc[0].s : 0;
  const top = best > 0 ? Math.min(5, sc.filter(function (x) { return x.s >= Math.max(1, best - 2); }).length) : 10;
  const out = [];
  while (out.length < (n || 4) && sc.length) out.push(sc.splice(Math.floor(Math.random() * Math.min(sc.length, out.length ? 20 : top)), 1)[0].p);
  return out;
}
// Unsplash photos for a list of searches: the first (most specific) one, then the next if it found fewer than 4
// photos, or fewer than 4 that pass the relevance check.
async function unsplashPhotos(query, env, n, rel) {
  try {
    const qs = (Array.isArray(query) ? query : [query]).filter(Boolean);
    const t0 = Date.now();
    let list = await unsplashSearch(qs[0], env, 4500);
    const weak = !!(list && rel && list.some(function (p) { return p.txt; }) && list.filter(function (p) { return v3PhotoScore(p, rel) > 0; }).length < 4);
    if (list && (list.length < 4 || weak) && qs[1] && qs[1] !== qs[0] && Date.now() - t0 < 3000) { const more = await unsplashSearch(qs[1], env, 3000); if (more) list = list.concat(more); }
    return v3PickPhotos(list || [], n || 4, rel);
  } catch (e) { return []; }
}

// ── The business's own photos from its Google listing (Places API (New), field mask "photos") ──
// Google bills every call, so: the photo list (resource names) is cached in KV for 24 hours (one details
// call serves every slot), each photo's image URL is cached in KV and the 302 at the edge for 7 days, and a
// hard monthly cap (GPHOTO_MONTHLY_CAP, default 900, inside Google's free 1,000) counts every real call in
// KV. At the cap no Google call is made: the generator uses Unsplash and /api/place-photo redirects to the
// site's Unsplash backup (fb). Sites never see the API key. k = a short hash of the photo's name, so the
// right photo is found even if Google reorders the list (falls back to index i).
const GPLACE_RE = /^[A-Za-z0-9_-]{10,300}$/;
const GPHOTO_FB_RE = /^https:\/\/images\.unsplash\.com\/[A-Za-z0-9._~\/?&=%+-]{1,400}$/;
function v3Hash(s) { s = String(s || ''); let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
// Billed Place Details / Text Search calls (reviews widget, setup lookups): a hard monthly cap like the photo cap,
// inside Google's free tier (PLACES_MONTHLY_CAP, default 4500). Cached answers never count.
function placesCap(env) { const n = parseInt(env && env.PLACES_MONTHLY_CAP, 10); return isNaN(n) || n < 0 ? 4500 : n; }
async function placesSpend(env) {
  if (!env || !env.KV) return true;
  try { const k = 'places:count:' + new Date().toISOString().slice(0, 7); const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= placesCap(env)) return false; await env.KV.put(k, String(n + 1), { expirationTtl: 40 * 86400 }); } catch (e) {}
  return true;
}
function gphotoKey() { return 'gphoto:count:' + new Date().toISOString().slice(0, 7); }
function gphotoCap(env) { const n = parseInt(env && env.GPHOTO_MONTHLY_CAP, 10); return isNaN(n) || n < 0 ? 900 : n; }
// Billed Google calls left this month (0 without KV: no counter, no calls).
async function gphotoLeft(env) { if (!env || !env.KV) return 0; try { return Math.max(0, gphotoCap(env) - (parseInt((await env.KV.get(gphotoKey())) || '0', 10) || 0)); } catch (e) { return 0; } }
// Count one billed call before making it; false = the cap is reached, don't call Google.
async function gphotoSpend(env) {
  if (!env || !env.KV) return false;
  try { const k = gphotoKey(); const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= gphotoCap(env)) return false; await env.KV.put(k, String(n + 1), { expirationTtl: 40 * 86400 }); return true; } catch (e) { return false; }
}
async function placePhotoList(pid, env, ms) {
  if (!env || !env.GOOGLE_PLACES_KEY || !GPLACE_RE.test(String(pid || ''))) return null;
  const ck = 'pphotos:' + pid;
  try { if (env.KV) { const c = await env.KV.get(ck); if (c) return JSON.parse(c); } } catch (e) {}
  if (!(await gphotoSpend(env))) return null;
  const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  const to = ctrl ? setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, ms || 3000) : 0;
  let r;
  try { r = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(pid), { headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'photos' }, signal: ctrl ? ctrl.signal : undefined }); }
  catch (e) { return null; }
  finally { if (to) clearTimeout(to); }
  if (!r || !r.ok) return null;
  let j; try { j = await r.json(); } catch (e) { return null; }
  const out = ((j && j.photos) || []).slice(0, 10).map(function (p) {
    if (!p || !/^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/.test(String(p.name || ''))) return null;
    const a = (p.authorAttributions || [])[0] || {};
    let link = String(a.uri || ''); if (link.indexOf('//') === 0) link = 'https:' + link;
    return { name: p.name, w: +p.widthPx || 0, h: +p.heightPx || 0, by: String(a.displayName || '').slice(0, 80), link: /^https:\/\/[^\s"'<>]+$/.test(link) ? link.slice(0, 300) : '' };
  }).filter(Boolean);
  try { if (env.KV) await env.KV.put(ck, JSON.stringify(out), { expirationTtl: 24 * 3600 }); } catch (e) {}
  return out;
}
// Google photos → site photo entries: a landscape photo for the hero when there is one, then the rest in order.
// backups[j] (an Unsplash photo) rides along as fb, so the slot still shows a photo once the monthly cap is hit.
function v3GooglePhotos(pid, list, n, backups) {
  if (!GPLACE_RE.test(String(pid || '')) || !Array.isArray(list) || !list.length) return [];
  let hero = list.findIndex(function (p) { return p.w > p.h; }); if (hero < 0) hero = 0;
  const order = [hero].concat(list.map(function (p, i) { return i; }).filter(function (i) { return i !== hero; })).slice(0, n || 4);
  return order.map(function (i, j) {
    const p = list[i], b = (backups || [])[j];
    const fb = b && GPHOTO_FB_RE.test(b.url) ? b : null;
    return { url: 'https://websprout.app/api/place-photo?pid=' + encodeURIComponent(pid) + '&i=' + i + '&w=1600&k=' + v3Hash(p.name) + (fb ? '&fb=' + encodeURIComponent(fb.url) : ''), name: p.by || 'Google user', link: p.link || '', source: 'google', fallback: fb ? { url: fb.url, name: fb.name, link: fb.link } : null };
  });
}
// GET /api/place-photo?pid=<place id>&i=<0-9>&w=<400-1600>[&k=<hash>][&fb=<Unsplash URL>] → 302 to the photo.
// Cap reached or any failure → 302 to fb when given, else 404 (the site's image collapses to its fallback).
async function doPlacePhoto(request, env) {
  const url = new URL(request.url);
  const pid = (url.searchParams.get('pid') || '').trim(), i = url.searchParams.get('i') || '0', k = url.searchParams.get('k') || '', fb = url.searchParams.get('fb') || '';
  const nope = function (status, ttl) { return new Response(status === 400 ? 'Bad request' : 'Not found', { status: status, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain', 'Cache-Control': ttl ? 'public, max-age=' + ttl : 'no-store' } }); };
  if (!GPLACE_RE.test(pid) || !/^\d$/.test(i) || !/^[a-z0-9]{0,8}$/.test(k) || (fb && !GPHOTO_FB_RE.test(fb))) return nope(400);
  // Always fetch one size from Google: each width would be a separate billed call, and the srcset asks for several.
  const w = 1600;
  // Not cached at the edge: once the month rolls over the real photo comes back.
  const backup = function () { return fb ? new Response(null, { status: 302, headers: { 'Location': fb, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' } }) : nope(404); };
  if (!env.GOOGLE_PLACES_KEY) return backup();
  const cache = (typeof caches !== 'undefined' && caches.default) || null;
  const ckey = new Request('https://websprout.app/api/place-photo?pid=' + encodeURIComponent(pid) + '&i=' + i + '&w=' + w + '&k=' + k);
  try { if (cache) { const hit = await cache.match(ckey); if (hit) return hit; } } catch (e) {}
  const found = function (uri) { return new Response(null, { status: 302, headers: { 'Location': uri, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=604800' } }); };
  try {
    // Known image URL (another data center already asked Google): no Google call at all, not even for the list.
    let known = ''; try { if (k && env.KV) known = (await env.KV.get('pphoto:' + pid + ':' + k + ':' + w)) || ''; } catch (e) {}
    if (known) { const res = found(known); try { if (cache) await cache.put(ckey, res.clone()); } catch (e) {} return res; }
    const list = await placePhotoList(pid, env, 5000);
    if (!list) return backup();
    const ph = (k && list.find(function (p) { return v3Hash(p.name) === k; })) || list[+i];
    if (!ph) return fb ? backup() : nope(404, 3600);
    const uk = 'pphoto:' + pid + ':' + v3Hash(ph.name) + ':' + w;
    let uri = ''; try { if (env.KV) uri = (await env.KV.get(uk)) || ''; } catch (e) {}
    if (!uri) {
      if (!(await gphotoSpend(env))) return backup();
      const r = await fetch('https://places.googleapis.com/v1/' + ph.name + '/media?maxWidthPx=' + w + '&skipHttpRedirect=true', { headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY } });
      const j = r.ok ? await r.json() : null;
      uri = String((j && j.photoUri) || '');
      if (!/^https:\/\/[^\s"'<>]+$/.test(uri)) return backup();
      try { if (env.KV) await env.KV.put(uk, uri, { expirationTtl: 7 * 86400 }); } catch (e) {}
    }
    const res = found(uri);
    try { if (cache) await cache.put(ckey, res.clone()); } catch (e) {}
    return res;
  } catch (e) { return backup(); }
}

// ── Google rating + reviews for published sites (Places API (New); needs GOOGLE_PLACES_KEY) ──
// Responses are cached for 6 hours so a busy site does not spend API quota on every visit.
async function doPlace(request, env) {
  const url = new URL(request.url);
  const id = (url.searchParams.get('place') || '').trim();
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' };
  if (!/^[A-Za-z0-9_-]{10,300}$/.test(id)) return new Response(JSON.stringify({ error: 'bad place' }), { status: 400, headers: cors });
  if (!env.GOOGLE_PLACES_KEY) return new Response(JSON.stringify({ error: 'not configured' }), { status: 503, headers: cors });
  try {
    const ck = 'place2:' + id; // v2: reviews carry an id (so owners can hide one) and a link to it on Google
    if (env.KV) { const c = await env.KV.get(ck); if (c) return new Response(c, { headers: cors }); }
    const busy = function () { return new Response(JSON.stringify({ error: 'busy' }), { status: 429, headers: Object.assign({}, cors, { 'Cache-Control': 'no-store' }) }); };
    if (!(await wsRate(env, 'plrate:' + wsClientIp(request, env), 30, 3600))) return busy();
    if (!(await placesSpend(env))) return busy();
    const r = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(id), { headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews' } });
    if (!r.ok) return new Response(JSON.stringify({ error: 'google error' }), { status: 502, headers: cors });
    const p = await r.json();
    const out = JSON.stringify({
      name: (p.displayName && p.displayName.text) || '', rating: typeof p.rating === 'number' ? p.rating : null, reviews: typeof p.userRatingCount === 'number' ? p.userRatingCount : null, url: /^https:\/\/[^\s"'<>]+$/.test(String(p.googleMapsUri || '')) ? String(p.googleMapsUri).slice(0, 400) : '',
      items: (p.reviews || []).slice(0, 5).map(function (v) { const rid = String(v.name || '').split('/').pop().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80); return { id: rid, link: /^https:\/\/[^\s"'<>]+$/.test(String(v.googleMapsUri || '')) ? String(v.googleMapsUri).slice(0, 400) : '', rating: v.rating || 0, text: String((v.text && v.text.text) || (v.originalText && v.originalText.text) || '').slice(0, 600), name: (v.authorAttribution && v.authorAttribution.displayName) || 'Google user', when: v.relativePublishTimeDescription || '' }; }).filter(function (v) { return v.text; }),
    });
    if (env.KV) await env.KV.put(ck, out, { expirationTtl: 6 * 3600 });
    return new Response(out, { headers: cors });
  } catch (e) { return new Response(JSON.stringify({ error: 'failed' }), { status: 500, headers: cors }); }
}
// Find a business's Google place from its name and city (used once, in the editor).
async function doPlaceFind(request, env) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 120);
  if (!env.GOOGLE_PLACES_KEY) return jsonR({ ok: false, error: 'Google lookups are not available yet.', results: [] });
  if (q.length < 3) return jsonR({ ok: true, results: [] });
  try {
    if (env.KV) { const ip = wsClientIp(request, env); const k = 'pfrate:' + ip; const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= 30) return jsonR({ ok: false, error: 'Too many lookups. Try again later.', results: [] }, 429); await env.KV.put(k, String(n + 1), { expirationTtl: 3600 }); }
    if (!(await placesSpend(env))) return jsonR({ ok: false, error: 'Google lookups are busy this month. Please fill in your details by hand.', results: [] }, 429);
    const r = await fetch('https://places.googleapis.com/v1/places:searchText', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount' }, body: JSON.stringify({ textQuery: q, pageSize: 5 }) });
    const j = await r.json();
    return jsonR({ ok: true, results: ((j && j.places) || []).map(function (p) { return { id: p.id, name: (p.displayName && p.displayName.text) || '', address: p.formattedAddress || '', rating: p.rating || null, count: p.userRatingCount || 0 }; }) });
  } catch (e) { return jsonR({ ok: false, error: 'Lookup failed.', results: [] }); }
}

// Google Places (New) place → setup fields, so a business can start from its Google listing.
// Pure (no fetch) so tests can feed it a recorded response.
function placeToSetup(p) {
  p = p || {};
  const txt = function (x) { return String((x && (x.text || x)) || '').trim(); };
  const pad = function (n) { return (n < 10 ? '0' : '') + n; };
  const comp = function (type) { const c = (p.addressComponents || []).find(function (a) { return (a.types || []).indexOf(type) > -1; }); return c ? String(c.longText || c.shortText || '') : ''; };
  // Google days: 0 = Sunday. Ours: index 0 = Monday. Split shifts (lunch breaks) → earliest open, latest close.
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [];
  const periods = (p.regularOpeningHours && p.regularOpeningHours.periods) || [];
  if (periods.length) {
    DAYS.forEach(function (d) { hours.push({ d: d }); });
    periods.forEach(function (pr) {
      if (!pr || !pr.open || typeof pr.open.day !== 'number') return;
      const i = (pr.open.day + 6) % 7;
      const o = pad(pr.open.hour || 0) + ':' + pad(pr.open.minute || 0);
      const c = pr.close ? pad(pr.close.hour || 0) + ':' + pad(pr.close.minute || 0) : '';
      if (!pr.close) { DAYS.forEach(function (d, k) { hours[k] = { d: d, open: '00:00', close: '23:59' }; }); return; }
      const h = hours[i];
      if (!h.open || o < h.open) h.open = o;
      const endsNextDay = pr.close.day !== pr.open.day;
      if (!h.close || endsNextDay || (h.close >= h.open && c > h.close)) h.close = c;
    });
  }
  const reviews = (p.reviews || []).filter(function (v) { return (v.rating || 0) >= 4; }).map(function (v) {
    return { quote: txt(v.text || v.originalText).slice(0, 240), name: String((v.authorAttribution && v.authorAttribution.displayName) || '').slice(0, 60) };
  }).filter(function (v) { return v.quote.length > 15; }).slice(0, 6);
  const addr = String(p.shortFormattedAddress || p.formattedAddress || '').slice(0, 160);
  return {
    googlePlaceId: /^[A-Za-z0-9_-]{10,300}$/.test(String(p.id || '')) ? String(p.id) : '',
    name: txt(p.displayName).slice(0, 80),
    type: txt(p.primaryTypeDisplayName).slice(0, 60),
    address: addr,
    city: comp('locality') || comp('postal_town') || comp('administrative_area_level_2'),
    phone: String(p.nationalPhoneNumber || p.internationalPhoneNumber || '').slice(0, 40),
    about: txt(p.editorialSummary).slice(0, 400),
    hours: hours,
    reviews: reviews,
    rating: typeof p.rating === 'number' ? p.rating : null,
    count: typeof p.userRatingCount === 'number' ? p.userRatingCount : 0,
  };
}
async function doPlaceDetails(request, env) {
  const id = (new URL(request.url).searchParams.get('place') || '').trim();
  if (!/^[A-Za-z0-9_-]{10,300}$/.test(id)) return jsonR({ ok: false, error: 'Bad place.' }, 400);
  if (!env.GOOGLE_PLACES_KEY) return jsonR({ ok: false, error: 'Google lookups are not available yet.' });
  try {
    if (env.KV) { const ip = wsClientIp(request, env); const k = 'pdrate:' + ip; const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= 20) return jsonR({ ok: false, error: 'Too many lookups. Try again later.' }, 429); await env.KV.put(k, String(n + 1), { expirationTtl: 3600 }); }
    if (!(await placesSpend(env))) return jsonR({ ok: false, error: 'Google lookups are busy this month. Please fill in your details by hand.' }, 429);
    const r = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(id), { headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'id,displayName,primaryTypeDisplayName,formattedAddress,shortFormattedAddress,addressComponents,nationalPhoneNumber,internationalPhoneNumber,regularOpeningHours,editorialSummary,rating,userRatingCount,reviews' } });
    if (!r.ok) return jsonR({ ok: false, error: 'Google could not find that listing.' }, 502);
    return jsonR(Object.assign({ ok: true }, placeToSetup(await r.json())));
  } catch (e) { return jsonR({ ok: false, error: 'Lookup failed.' }); }
}

// Stock photo search for the editor's photo picker (Unsplash; needs UNSPLASH_ACCESS_KEY).
async function doPhotoSearch(request, env) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().slice(0, 80);
  if (!env.UNSPLASH_ACCESS_KEY) return jsonR({ ok: false, error: 'Photo search is not set up yet.', results: [] });
  if (!q) return jsonR({ ok: true, results: [] });
  try {
    if (env.KV) {
      const ip = request.headers.get('cf-connecting-ip') || '0'; const k = 'phrate:' + ip;
      const n = parseInt((await env.KV.get(k)) || '0', 10) || 0;
      if (n >= 60) return jsonR({ ok: false, error: 'Too many searches. Please wait a few minutes.', results: [] }, 429);
      await env.KV.put(k, String(n + 1), { expirationTtl: 3600 });
    }
    if (!(await unsplashSpend(env))) return jsonR({ ok: false, error: 'Photo search is busy. Try again soon.', results: [] });
    const r = await fetch('https://api.unsplash.com/search/photos?per_page=18&content_filter=high&query=' + encodeURIComponent(q), { headers: { 'Authorization': 'Client-ID ' + env.UNSPLASH_ACCESS_KEY, 'Accept-Version': 'v1' } });
    if (!r.ok) return jsonR({ ok: false, error: 'Photo search is busy. Try again soon.', results: [] });
    const j = await r.json();
    const results = ((j && j.results) || []).map(function (p) {
      const raw = (p.urls && (p.urls.regular || p.urls.raw)) || ''; const u = p.user || {};
      return raw ? { thumb: (p.urls && p.urls.small) || raw, url: raw + (raw.indexOf('?') > -1 ? '&' : '?') + 'w=1680&q=75&auto=format&fit=crop', alt: String(p.alt_description || '').slice(0, 120), name: u.name || 'Unsplash', link: (u.links && u.links.html) || 'https://unsplash.com', download: (p.links && p.links.download_location) || '' } : null;
    }).filter(Boolean);
    return jsonR({ ok: true, results: results });
  } catch (e) { return jsonR({ ok: false, error: 'Photo search failed.', results: [] }); }
}
// Unsplash asks apps to ping a photo's download_location when someone uses it.
async function doPhotoUse(request, env) {
  try {
    const b = await request.json();
    const d = String((b && b.download) || '');
    if (env.UNSPLASH_ACCESS_KEY && /^https:\/\/api\.unsplash\.com\/photos\/[A-Za-z0-9_-]+\/download/.test(d)) await fetch(d, { headers: { 'Authorization': 'Client-ID ' + env.UNSPLASH_ACCESS_KEY } });
  } catch (e) {}
  return jsonR({ ok: true });
}

// Home page recipes per business family. Each key names a block built in v3Pages; a block with nothing real
// to show (no reviews, no team, no stats) drops out, so a recipe never renders an empty or invented section.
// Two businesses of the same family get different recipes and layouts (seeded per business).
const V3_RECIPES = {
  food: [['intro', 'menu', 'gallery', 'reviews', 'visit', 'cta'], ['menu', 'intro', 'gallery', 'reviews', 'visit', 'cta'], ['intro', 'gallery', 'menu', 'reviews', 'visit', 'cta']],
  trades: [['stats', 'menu', 'steps', 'reviews', 'visit', 'cta'], ['stats', 'menu', 'reviews', 'steps', 'visit', 'cta'], ['menu', 'stats', 'steps', 'reviews', 'faq', 'visit', 'cta']],
  beauty: [['menu', 'intro', 'gallery', 'team', 'reviews', 'visit', 'cta'], ['menu', 'gallery', 'intro', 'team', 'reviews', 'visit', 'cta'], ['gallery', 'menu', 'intro', 'team', 'reviews', 'visit', 'cta']],
  pro: [['intro', 'stats', 'menu', 'steps', 'reviews', 'faq', 'cta'], ['intro', 'menu', 'steps', 'faq', 'reviews', 'cta'], ['menu', 'intro', 'stats', 'steps', 'reviews', 'faq', 'cta']],
  creative: [['gallery', 'intro', 'menu', 'reviews', 'steps', 'cta'], ['intro', 'gallery', 'menu', 'steps', 'reviews', 'cta']],
  retail: [['menu', 'intro', 'gallery', 'reviews', 'visit', 'cta'], ['menu', 'gallery', 'intro', 'reviews', 'visit', 'cta']],
};
// Page order per family (nav order). Professionals lead with who they are; trades put the quote last.
const V3_PAGE_ORDER = {
  food: ['home', 'main', 'book', 'about', 'contact'], beauty: ['home', 'main', 'book', 'about', 'contact'],
  trades: ['home', 'main', 'about', 'book', 'contact'], pro: ['home', 'about', 'main', 'book', 'contact'],
  creative: ['home', 'main', 'about', 'book', 'contact'], retail: ['home', 'main', 'about', 'book', 'contact'],
};
// Layout options per family (repeats weight a choice). Photo-led layouts only when that section has a photo;
// v3Look drops any option the engine doesn't offer.
const V3_LOOKS = {
  heroPhoto: { food: ['photo', 'center', 'split', 'minimal'], trades: ['frame', 'frame', 'photo', 'split'], beauty: ['center', 'split', 'photo', 'minimal'], pro: ['frame', 'frame', 'split', 'photo'], creative: ['photo', 'center', 'minimal'], retail: ['minimal', 'photo', 'split'] },
  heroPlain: { food: ['photo', 'center', 'type'], trades: ['photo', 'type'], beauty: ['center', 'type', 'photo'], pro: ['photo', 'center'], creative: ['center', 'type'], retail: ['type', 'photo'] },
  menu: { food: ['grid', 'list', 'feature'], trades: ['numbered', 'list', 'grid'], beauty: ['grid', 'list'], pro: ['grid', 'numbered', 'list'], creative: ['grid', 'feature', 'list'], retail: ['grid', 'grid', 'list'] },
  mainList: { food: ['list', 'feature', 'grid'], trades: ['grid', 'rows', 'numbered'], beauty: ['list', 'rows', 'grid'], pro: ['rows', 'rows', 'grid', 'list'], creative: ['grid', 'feature'], retail: ['grid'] },
  gallery: { food: ['bento', 'strip'], trades: ['strip'], beauty: ['bento', 'strip'], pro: ['strip'], creative: ['bento', 'bento', 'strip'], retail: ['strip', 'bento'] },
  steps: { food: ['grid'], trades: ['line', 'line', 'grid'], beauty: ['grid'], pro: ['line', 'grid'], creative: ['grid', 'line'], retail: ['grid'] },
  intro: { food: ['center'], trades: ['center'], beauty: ['center'], pro: ['columns', 'center'], creative: ['center'], retail: ['center'] },
  cta: { food: ['card', 'band'], trades: ['band', 'card'], beauty: ['card', 'band'], pro: ['card', 'band'], creative: ['card', 'band'], retail: ['band', 'card'] },
  reviews: { food: ['feature', 'wall'], trades: ['wall', 'feature'], beauty: ['wall', 'feature'], pro: ['feature', 'wall'], creative: ['feature', 'wall'], retail: ['wall', 'feature'] },
  stats: { food: ['row'], trades: ['band', 'row'], beauty: ['row'], pro: ['row', 'band'], creative: ['row'], retail: ['row'] },
};
function v3Look(type, opts) {
  const ok = (WSENGINE.sections[type] && WSENGINE.sections[type].variants) || {};
  const list = (opts || []).filter((v) => ok[v]);
  return list.length ? v3Pick(list) : Object.keys(ok)[0];
}
// Heading for the location/hours band. Never built from a truncated street name ("Find us on India.").
function v3VisitTitle(fam, act, b, cat) {
  const city = v3City(b);
  if (act === 'truck') return city ? 'Find us around ' + city + '.' : 'Where to find us.';
  if (fam === 'trades' && !(cat === 'auto' && b.address)) return city ? v3Pick(['Serving ' + city + ' and nearby.', 'Working in and around ' + city + '.']) : (b.address ? 'Where to find us.' : 'Get in touch.');
  if (!b.address) return city ? v3Pick(['Based in ' + city + '.', 'Find us in ' + city + '.']) : 'Get in touch.';
  const pools = { food: cat === 'restaurant' ? ['Come and eat with us.', 'Find us.', 'Visit us.'] : ['Come by.', 'Find us.', 'Visit us.'], beauty: ['Visit us.', 'Find us.', 'Come and see us.'], pro: ['Visit our office.', 'Find us.', 'Where to find us.'], retail: cat === 'retail' ? ['Visit the shop.', 'Find us.', 'Come and see us.'] : ['Visit us.', 'Find us.', 'Come and see us.'] };
  return v3Pick(pools[fam] || ['Find us.', 'Visit us.']);
}

// ── The owner's own answers from setup: what makes them different, founding year, licensed/insured, towns ──
// Plain text only (tags and markup characters dropped), trimmed and capped. Real answers come first everywhere
// they're used; nothing here is ever filled in when the owner left it blank.
function v3Clean(s, n) { return String(s == null ? '' : s).replace(/<[^>]*>?/g, ' ').replace(/[<>{}\[\]"`\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, n || 200).trim(); }
function v3Year(x) { const s = String(x == null ? '' : x).trim(), y = parseInt(s, 10); return /^\d{4}$/.test(s) && y >= 1850 && y <= new Date().getFullYear() ? s : ''; }
// "springfield, SHELBYVILLE\nst. louis" → ['Springfield', 'Shelbyville', 'St. Louis']: up to 12, de-duplicated, each ≤40 chars.
function v3Towns(x) {
  const out = [], seen = {};
  (Array.isArray(x) ? x.join(',') : String(x == null ? '' : x)).slice(0, 300).split(/[,;\n\r]+/).forEach(function (t) {
    t = v3Clean(t, 40).replace(/^[\s.,'’&-]+|[\s,&-]+$/g, '');
    if (!t || !/[a-z]/i.test(t)) return;
    if (t === t.toLowerCase() || t === t.toUpperCase()) t = t.toLowerCase().replace(/(^|[\s-])([a-z])/g, function (m, a, c) { return a + c.toUpperCase(); });
    const k = t.toLowerCase(); if (!seen[k]) { seen[k] = 1; out.push(t); }
  });
  return out.slice(0, 12);
}
// Their words, lightly tidied: a capital at the start and a full stop at the end. Nothing added.
// Near-duplicate detection on meaningful words (≥4 letters, crude plural strip), for dropping repeated sentences
// (an AI paraphrase of the owner's answer next to the answer itself) and why points that restate it.
const V3_STOP = { that: 1, this: 1, with: 1, your: 1, from: 1, have: 1, will: 1, what: 1, when: 1, they: 1, them: 1, there: 1, their: 1, were: 1, been: 1, into: 1, just: 1, make: 1, every: 1, about: 1, also: 1, here: 1, more: 1, than: 1, then: 1, want: 1, work: 1, sure: 1 };
function v3SigWords(t) { const o = {}; String(t || '').toLowerCase().replace(/[’']/g, '').split(/[^a-z]+/).forEach(function (w) { if (w.length >= 4 && !V3_STOP[w]) o[w.replace(/(?:ies)$/, 'y').replace(/(?<!s)s$/, '')] = 1; }); return o; }
function v3Overlap(a, b) { const A = v3SigWords(a), B = v3SigWords(b), ka = Object.keys(A), kb = Object.keys(B); if (!ka.length || !kb.length) return 0; let n = 0; ka.forEach(function (w) { if (B[w]) n++; }); return n / Math.min(ka.length, kb.length); }
function v3Dedupe(text) { const out = []; (String(text || '').match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || []).forEach(function (x) { x = x.trim(); if (x && !out.some(function (y) { return v3Overlap(x, y) >= 0.5; })) out.push(x); }); return out.join(' '); }
function v3Sentence(s) { s = String(s || '').trim(); if (!s) return ''; s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?…]$/.test(s) ? s : s + '.'; }
function v3And(a) { return a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
// The city as people say it in a sentence: "Asheville, NC", "Austin, TX 78701" or "Asheville North Carolina" →
// "Asheville". Used in all generated prose ("Serving Asheville since 2009"); the full city stays in the contact
// details, footer and structured data, where the state belongs.
const V3_STATES = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|District of Columbia';
const V3_STATE_ABBR = 'AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC';
const V3_CITY_TAIL = new RegExp('\\s+(?:(?:' + V3_STATE_ABBR + ')|(?:' + V3_STATES.replace(/(\w)(\w*)/g, function (m, a, b) { return '[' + a.toUpperCase() + a.toLowerCase() + ']' + b; }) + '))\\.?$');
function v3CityName(c) {
  const full = String(c == null ? '' : c).replace(/\s+/g, ' ').trim();
  let s = full.replace(/[\s,]*\b\d{5}(?:-\d{4})?$/, '').trim();
  if (s.indexOf(',') > 0) s = s.slice(0, s.indexOf(',')).trim();
  else s = s.replace(V3_CITY_TAIL, '').trim();
  return s || full;
}
function v3City(b) { return v3CityName(b && b.city); }
// Towns other than the home city, for "serving <city> and nearby towns including …".
function v3Nearby(b) { const c = v3City(b).toLowerCase(); return (b.towns || []).filter(function (t) { return t.toLowerCase() !== c; }); }
function v3ServeLine(b) {
  const city = v3City(b), near = v3Nearby(b);
  if (!near.length) return '';
  if (!city) return 'We work in ' + v3And(near.slice(0, 3)) + (near.length > 3 ? ' and nearby towns.' : '.');
  return near.length === 1 ? 'Serving ' + city + ' and ' + near[0] + '.' : 'Serving ' + city + ' and nearby towns including ' + near[0] + ' and ' + near[1] + '.';
}
function v3Years(b) { return b.founded ? new Date().getFullYear() - parseInt(b.founded, 10) : -1; }
// Businesses that go to their customers (trades, cleaners, movers, mobile services) get an "Areas we serve" block.
function v3ServiceArea(fam, cat, type, b) { return (fam === 'trades' && !(cat === 'auto' && b.address && !/mobile/i.test(type))) || /\bmobile\b|dog walk|pet sit|house ?sit|walker|we come to you/i.test(String(type || '')); }
// Trust badges, from real data only: licensed, insured, founding year, a linked Google rating, the towns served.
function v3TrustItems(b) {
  const out = [], city = v3City(b), near = v3Nearby(b);
  if (b.licensed) out.push({ icon: 'shield-check', label: 'Licensed', source: 'licensed' });
  if (b.insured) out.push({ icon: 'shield', label: 'Insured', source: 'insured' });
  if (b.founded) { const n = v3Years(b); out.push({ icon: 'calendar', label: n >= 2 ? n + ' years in business' : 'Since ' + b.founded, source: 'years' }); }
  if (b.googlePlaceId && b.googleRating >= 1) out.push({ icon: 'star', label: b.googleRating.toFixed(1) + ' on Google' + (b.googleReviews ? ' (' + b.googleReviews + ' reviews)' : ''), source: 'google_rating' });
  if ((b.towns || []).length) out.push({ icon: 'map-pin', label: 'Serving ' + (city || b.towns[0]) + (near.length > (city ? 0 : 1) ? ' and nearby' : ''), source: 'area' });
  return out;
}
// The home page gets a trust strip (trades and professionals, at least two real badges): what it already says
// (licensed, insured, since when) isn't repeated in the why points or the call to action.
function v3TrustOn(b, fam) { return (fam === 'trades' || fam === 'pro') && typeof WSENGINE !== 'undefined' && !!(WSENGINE.sections && WSENGINE.sections.trust) && v3TrustItems(b).length >= 2; }
// A short title from the owner's own answer: its first clause ("Family-owned, we answer the phone ourselves…" →
// "Family-owned"), ≤36 characters, tidied capitals, never reworded. '' when there's no clean clause to use.
function v3UniqueTitle(u) {
  const m = String(u || '').trim().match(/^([^,;:.!?–—]+?)\s*(?:[,;:.!?]|\s[–—-]\s)\s*(.*)$/);
  if (!m) return null;
  let lead = m[1].trim();
  const rest = m[2].trim(), w = lead.split(/\s+/).length;
  if (!(w >= 2 || /^[A-Za-z]{3,}-[A-Za-z]{3,}$/.test(lead)) || w > 7 || lead.length > 36 || /^(we|i|our|my|us|they|it|you|we’re|we're|i’m|i'm|this|there)\b/i.test(lead) || rest.split(/\s+/).length < 3) return null;
  if (lead === lead.toUpperCase()) lead = lead.toLowerCase();
  return { title: lead.charAt(0).toUpperCase() + lead.slice(1), text: rest };
}
// "Why choose us": the owner's own answers first, then honest points for the kind of business. 3–4 items.
// trust: the trust strip is on the same page, so licensed/insured is left to it, and the years point (and the local
// point, when the areas block is there too) is used only when there aren't three points without it.
function v3WhyItems(b, cat, fam, hasArea, trust) {
  const out = [], city = v3City(b), n = v3Years(b);
  const spares = [];
  if (b.unique) {
    const u = String(b.unique).trim(), t = v3UniqueTitle(u);
    out.push({ icon: 'sparkles', title: t ? t.title : v3Pick(['What sets us apart', 'What makes us different']), text: v3Sentence(t ? t.text : u), source: 'unique' });
  }
  if ((b.licensed || b.insured) && !trust) out.push(b.licensed && b.insured ? { icon: 'shield-check', title: 'Licensed and insured', text: 'Fully licensed and insured, so you’re covered.', source: 'licensed' } : b.licensed ? { icon: 'shield-check', title: 'Fully licensed', text: 'We’re licensed, and happy to share the details.', source: 'licensed' } : { icon: 'shield-check', title: 'Fully insured', text: 'We’re insured, so you’re covered while we work.', source: 'insured' });
  if (b.founded) { const y = { icon: 'calendar', title: n >= 2 ? n + ' years in ' + (city || 'business') : 'Since ' + b.founded, text: city ? 'Serving ' + city + ' since ' + b.founded + '.' : 'In business since ' + b.founded + '.', source: 'years' }; if (trust) spares.unshift(y); else out.push(y); }
  if (city || (b.towns || []).length) { const l = { icon: 'map-pin', title: city ? 'Local to ' + city : 'Local to the area', text: (hasArea && city && v3Nearby(b).length) ? 'Based in ' + city + ' and working in the towns around it.' : (v3ServeLine(b) || 'We’re based in ' + city + ', close to the people we work for.'), source: 'local' }; if (trust && hasArea && (b.towns || []).length) spares.push(l); else out.push(l); }
  const have = {}; out.forEach(function (x) { have[x.title.toLowerCase()] = 1; });
  const pool = (V3_WHY[cat] || []).concat(V3_WHY[cat === 'childcare' ? 'childcare' : fam] || V3_WHY.generic).filter(function (x, i, a) { return a.findIndex(function (y) { return y[1] === x[1]; }) === i && !have[x[1].toLowerCase()] && !(cat === 'cleaning' && /clean up/i.test(x[1])) && !(b.unique && Object.keys(v3SigWords(x[1] + ' ' + x[2])).some(function (w) { return w.length >= 6 && v3SigWords(b.unique)[w]; })); });
  while (out.length < 4 && pool.length) { const p = pool.splice(Math.floor(v3Rand() * pool.length), 1)[0]; out.push({ icon: p[0], title: p[1], text: p[2], source: 'starter' }); }
  while (out.length < 3 && spares.length) out.push(spares.shift());
  const ic = (typeof WSENGINE !== 'undefined' && WSENGINE.ICONS) || null;
  out.forEach(function (x) { if (ic && !ic[x.icon]) x.icon = 'circle-check'; });
  return out.slice(0, 4);
}
// The mark in the header until the owner uploads a logo: { style, icon }, a valid line-icon id, varied per business.
const V3_MARK_ICONS = [[/garage door/, ['house', 'wrench']], [/plumb|drain|sewer|water heater/, ['droplet', 'wrench']], [/electric/, ['zap', 'plug', 'lightbulb']], [/hvac|heating|furnace|air condition|cooling/, ['thermometer', 'snowflake', 'wind']], [/roof|gutter|siding/, ['house', 'hammer']], [/paint/, ['paintbrush', 'paint-roller']], [/pest/, ['bug']], [/pool/, ['waves', 'droplets']], [/lock/, ['key-round', 'lock']], [/appliance|washer|dryer|fridge|refrigerat|dishwasher/, ['washing-machine', 'wrench']], [/tree/, ['trees', 'tree-deciduous']], [/lawn|landscap|garden|yard|mow|turf/, ['leaf', 'sprout', 'trees']], [/clean|maid|janitor|housekeep|wash/, ['sparkles', 'spray-can']], [/mov|haul|junk/, ['truck', 'package']], [/auto|mechanic|car\b|tire|garage|detail/, ['car', 'wrench']], [/handy|contract|remodel|renovat|construct|build|carpent|deck|fence|floor|drywall|cabinet|countertop/, ['hammer', 'wrench', 'hard-hat']],
  [/coffee|cafe|espresso|roaster/, ['coffee']], [/cake|cupcake/, ['cake', 'cake-slice']], [/bak|pastr|patisserie|croissant|bread|bagel|donut/, ['croissant', 'wheat']], [/pizz/, ['pizza']], [/sushi|seafood|fish/, ['fish']], [/bbq|barbecue|smokehouse|grill|steak/, ['flame', 'beef']], [/taco|taqueria|burrito|cantina/, ['utensils-crossed']], [/ice cream|gelato|creamery|frozen yogurt/, ['ice-cream-cone']], [/\bbar\b|pub|brew|winery|wine|tavern|taproom/, ['wine']], [/juice|smoothie|boba|bubble tea/, ['cup-soda']], [/sandwich|deli/, ['sandwich']], [/soup|ramen|noodle|pho/, ['soup']]];
const V3_MARK_BY_CAT = { barber: ['razor', 'scissors'], salon: ['scissors'], spa: ['hand-heart', 'sparkle'], tattoo: ['pen-tool'], fitness: ['dumbbell'], pet: ['paw-print'], tailor: ['scissors', 'ruler'], legal: ['scale', 'landmark'], finance: ['chart-column', 'briefcase'], realestate: ['house', 'key-round'], dental: ['tooth'], health: ['heart-pulse', 'stethoscope'], studio: ['pen-tool', 'compass'], education: ['graduation-cap', 'book-open'], childcare: ['baby', 'blocks'], photo: ['camera'], events: ['party-popper', 'flower-2'], retail: ['shopping-bag', 'gem'], marine: ['anchor', 'sailboat'] };
function v3LogoMark(fam, cat, type) {
  const t = String(type || '').toLowerCase(), ic = WSENGINE.ICONS || {};
  const hit = V3_MARK_ICONS.find(function (x) { return x[0].test(t); });
  let opts = (hit ? hit[1] : fam === 'trades' ? ['wrench', 'hammer', 'house'] : fam === 'food' ? ['utensils', 'chef-hat'] : (V3_MARK_BY_CAT[cat] || [])).filter(function (x) { return ic[x]; });
  if (!opts.length) { let f = ''; try { f = WSENGINE.iconFor({}, type); } catch (e) {} opts = [ic[f] ? f : 'sparkles']; }
  const style = fam === 'trades' ? v3Pick(['badge', 'icon']) : (fam === 'pro' || fam === 'beauty') ? v3Pick(['wordmark', 'monogram']) : fam === 'food' ? v3Pick(['wordmark', 'icon']) : 'wordmark';
  return { style: style, icon: v3Pick(opts) };
}
// Starter FAQ answers that depend on the owner's answers: a licensing question is answered only from real data
// (and left out otherwise, see v3Starter), and "what areas do you cover" lists the towns they gave.
const V3_CRED_Q = /are you (?:fully )?(?:licen[sc]ed|insured)/i;
function v3CredOk(q, o) { if (!V3_CRED_Q.test(q)) return true; o = o || {}; const l = /licen/i.test(q), i = /insured/i.test(q); return (l && i) ? !!(o.licensed || o.insured) : l ? !!o.licensed : !!o.insured; }
function v3FaqFit(q, a, b) {
  if (V3_CRED_Q.test(q)) {
    if (b.licensed && b.insured) return 'Yes. We’re fully licensed and insured, and happy to share the details.';
    if (b.licensed) return 'Yes, we’re licensed. Ask us and we’ll share the details.';
    if (b.insured && /insured/i.test(q)) return 'We’re insured. Ask us and we’ll share the details for your job.';
    return a;
  }
  if (/what areas|where are you based|do you cover|which areas/i.test(q)) {
    const city = v3City(b), near = v3Nearby(b);
    if (near.length) return 'We work in ' + v3And((city ? [city] : []).concat(near.slice(0, city ? 4 : 5))) + (near.length > (city ? 4 : 5) ? ' and nearby towns' : '') + '. Not sure about yours? Send us your address and we’ll confirm.';
    if (city) return 'We’re based in ' + city + '. Send us your address and we’ll confirm we can help.';
  }
  return a;
}

// With a trust strip on the page, a licensing question is left out of that page's short FAQ (it's said once).
function v3TrustFaq(items, trust) { const k = (items || []).filter(function (x) { return !trust || !/licen[sc]|insur/i.test(String((x && x.q) || '')); }); return k.length >= 2 ? k : (items || []); }

// Split a finished flat section stack into a real multi-page site (Home + Shop/Menu/Services, booking page,
// About, Contact) with cross-page nav. Each section object is MOVED to exactly one page (photos/ids preserved);
// home follows its family's recipe and sub-pages get their own header + call-to-action. Keeps site.sections
// as a single-page fallback so legacy/one-page consumers still work.
function v3Pages(site, sc, isShop) {
  try {
    const all = (site.sections || []).slice();
    const first = (t) => all.find((s) => s.type === t);
    const many = (t) => all.filter((s) => s.type === t);
    const uid = () => WSENGINE.uid();
    const mk = (type, ov) => Object.assign({ id: type + '-' + uid(), type: type }, WSENGINE.sections[type].create(site), ov || {});
    const can = (type) => !!WSENGINE.sections[type];
    const b = site.biz;

    const announce = many('announce');
    const hero = first('hero');
    const intro = first('intro');
    const services = first('services');
    const products = first('products');
    const prices = first('prices');
    const reviews = first('reviews');
    const faq = first('faq');
    const visit = first('visit');
    const cta = first('cta');
    const stats = many('stats');
    const team = many('team');
    const gallery = many('gallery');
    const beforeafter = many('beforeafter');

    const cat = (sc && sc.category) || '';
    const L = (sc && sc.labels) || v3Labels(cat, b.type, isShop);
    const fam = L.family;
    const isFood = fam === 'food';
    const mainLabel = L.main, mainPath = L.mainPath;
    const bk = L.bk;
    if (bk) { b.bookShort = bk.short; b.bookLabel = bk.btn; } else { b.bookShort = L.bookShort; b.bookLabel = L.bookLabel; }
    const actLink = bk ? ('#/' + bk.path) : (isShop ? '#/' + mainPath : '#/contact');
    const ctaPool = (k, by) => (by && V3_COPY.aboutCtaBy[k]) || V3_COPY.pageCta[k] || V3_COPY.serviceCta;

    // ----- HOME: the family's recipe, filled only with what the site really has. Layouts are picked here,
    // after photos are known, so photo-led variants only go where there is a photo. -----
    const photos = site.photos || {};
    const hasPhoto = (sec) => !!(sec && photos[sec.id + '.photo']);
    const home = [];
    announce.forEach((s) => home.push(s));
    if (hero) {
      hero.variant = v3Look('hero', (hasPhoto(hero) ? V3_LOOKS.heroPhoto : V3_LOOKS.heroPlain)[fam]);
      if (hero.variant === 'type' && !hero.emoji) { try { hero.emoji = (WSENGINE.emojiRecsFor(b.type) || [])[0] || ''; } catch (e) {} }
      if (hero.variant === 'type' && !hero.emoji) hero.variant = 'photo';
      home.push(hero);
    }
    const mainSrc = products || services;
    const srcItems = mainSrc ? (mainSrc.items || []) : [];
    // Beauty businesses that typed real prices get a price board up front; everyone else a short teaser.
    const priced = !products && fam === 'beauty' && srcItems.length >= 3 && srcItems.every((it) => String(it.from || it.price || '').trim());
    let menu = null;
    if (priced) menu = mk('prices', { variant: v3Look('prices', ['board']), title: v3FlavorPick(sc && sc.servicesTitlePool) || 'Prices', note: '', items: srcItems.slice(0, 8).map((it) => ({ name: it.name || '', price: it.from || it.price || '', meta: '' })) });
    else if (srcItems.length) {
      const tpool = (sc && sc.servicesTitlePool) || [];
      const teaserTitle = products ? v3FlavorPick(V3_COPY.featured) : (isFood && tpool.indexOf('Menu') > -1) ? v3FlavorPick(V3_COPY.menuTeaser[cat] || V3_COPY.menuTeaser.restaurant) : (v3FlavorPick(tpool) || v3FlavorPick(V3_COPY.whatWeDo));
      menu = mk('services', { variant: v3Look('services', V3_LOOKS.menu[fam]), title: teaserTitle, items: srcItems.slice(0, 3).map((it) => ({ emoji: it.emoji || '', name: it.name || it.title || '', text: it.text || it.desc || '', from: it.price || it.from || '' })) });
    }
    // A short story band for home, using a different line than the About page will (no repeated paragraph).
    // Sections built from the owner's answers: trust badges right under the hero (trades and professionals, at least
    // two real badges), "why choose us" after the services (trades, professionals, beauty), and the towns they serve
    // near the end for businesses that go to their customers. Each only when the engine offers it and it has content.
    const trustItems = (fam === 'trades' || fam === 'pro') && can('trust') ? v3TrustItems(b) : [];
    const trust = trustItems.length >= 2 ? mk('trust', { variant: v3Look('trust', trustItems.length >= 3 ? ['strip', 'strip', 'cards'] : ['strip']), title: '' }) : null;
    const area = (b.towns || []).length && can('area') && v3ServiceArea(fam, cat, b.type, b) ? mk('area', { variant: v3Look('area', []), title: v3Pick(['Areas we serve', 'Where we work', 'Our service area']), text: [v3ServeLine(b) || (b.city ? 'Based in ' + v3City(b) + '.' : ''), 'Not sure if we cover your address? Get in touch and we’ll let you know.'].filter(Boolean).join(' ') }) : null;
    const whyItems = (fam === 'trades' || fam === 'pro' || fam === 'beauty') && can('why') ? v3WhyItems(b, cat, fam, !!area, !!trust) : [];
    const why = whyItems.length >= 3 ? mk('why', { variant: v3Look('why', ['grid', 'split']), title: v3Pick(['Why choose us', 'Why people choose us', 'Why work with us']), items: whyItems }) : null;
    let homeUsedIntro = false;
    let homeIntro = null;
    const V3_PROMISE = {
      beauty: ['Every visit starts with a conversation about what you want.', 'We take our time, do it properly and make you feel welcome.', 'Friendly people, careful work and a place you’ll look forward to coming back to.'],
      trades: ['We arrive when we say we will, do the job properly and leave everything tidy.', 'Clear prices, careful work and good communication from start to finish.', 'A local team that takes pride in every job.'],
      pro: ['Clear answers, fair prices and work we’re proud to put our name on.', 'We listen first, keep you informed and deliver what we promised.', 'Small enough to care, experienced enough to get it right.'],
    };
    V3_PROMISE.creative = V3_PROMISE.pro;
    const aboutPool = (((sc && sc.aboutPool) || (V3_FLAVORS[cat] && V3_FLAVORS[cat].about) || []).concat(V3_PROMISE[fam] || [])).filter((t) => t && t !== (intro && intro.text) && t !== (sc && sc.about));
    if (!menu && intro) { homeIntro = intro; homeUsedIntro = true; }
    else if (aboutPool.length) homeIntro = mk('intro', { variant: v3Look('intro', V3_LOOKS.intro[fam]), title: '', text: (b.unique && !why ? v3Sentence(b.unique) + ' ' : '') + v3Pick(aboutPool), emoji: '' });
    const steps = (!isShop && !isFood && fam !== 'retail' && cat !== 'generic' && (services || prices)) ? mk('steps', { variant: v3Look('steps', V3_LOOKS.steps[fam]), title: v3FlavorPick(V3_COPY.stepsTitle), items: v3StepsItems(cat) }) : null;
    const gal = gallery[0] || null;
    if (gal) gal.variant = v3Look('gallery', V3_LOOKS.gallery[fam]);
    // Short FAQs on professional and trades sites sit open (every answer visible); longer ones and other families fold.
    const faqVar = (n) => ((fam === 'pro' || fam === 'trades') && n >= 3 && n <= 4 && (WSENGINE.sections.faq.variants || {}).open) ? 'open' : 'accordion';
    const faqTop = faq && (faq.items || []).length >= 2 ? mk('faq', { variant: faqVar(Math.min(3, faq.items.length)), title: v3Pick(V3_COPY.faqTitle), items: v3TrustFaq((faq.items || []).slice(0, trust ? 4 : 3), !!trust).slice(0, 3) }) : null;
    const hasReach = !!(b.address || (b.hours || []).some((h) => h && h.open) || b.phone);
    // A business that comes to you has no place to "Visit": its location band is labelled as the service area.
    const visitEb = (fam === 'trades' && !b.address) ? (b.city ? 'Service area' : 'Contact') : null;
    const visitHome = (hasReach && visit) ? mk('visit', Object.assign({ variant: b.address ? v3Look('visit', ['hours', 'map']) : 'hours', title: v3VisitTitle(fam, L.act, b, cat) }, visitEb ? { eyebrow: visitEb } : {})) : null;
    const st = stats[0] || null;
    if (st) st.variant = v3Look('stats', V3_LOOKS.stats[fam]);
    const tm = team[0] || null;
    team.forEach((s) => { if (!String(s.title || '').trim()) s.title = v3Pick(V3_COPY.teamTitle); });
    if (reviews && reviews.variant !== 'google') reviews.variant = v3Look('reviews', ((reviews.items || []).length >= 3 ? ['cards', 'cards'] : []).concat(V3_LOOKS.reviews[fam]));
    // With a towns list the "Areas we serve" block takes the location band's place (contact details stay on Contact).
    const blocks = { intro: homeIntro, menu: menu, gallery: gal, reviews: reviews, visit: area || visitHome, cta: cta, steps: steps, faq: faqTop, stats: st, team: tm, why: why };
    const seen = new Set();
    let keys = v3Pick(V3_RECIPES[fam] || V3_RECIPES.pro).slice();
    // Trust badges carry the real numbers, so the numbers band moves to the About page.
    if (trust) { keys = keys.filter((k) => k !== 'stats'); home.push(trust); seen.add(trust); }
    if (why) {
      const at = (blocks.menu && keys.indexOf('menu') > -1) ? keys.indexOf('menu') : (blocks.intro && keys.indexOf('intro') > -1) ? keys.indexOf('intro') : keys.indexOf('cta') - 1;
      keys.splice(at + 1, 0, 'why');
      // Keep the page readable: the generic blocks give way first.
      (fam === 'beauty' ? ['intro', 'steps'] : ['steps', 'faq']).forEach((k) => { if (keys.filter((x) => blocks[x]).length > 7 && keys.indexOf(k) > -1) keys.splice(keys.indexOf(k), 1); });
    }
    keys.map((k) => blocks[k]).filter(Boolean).forEach((s) => { if (!seen.has(s)) { seen.add(s); home.push(s); } });
    // Sections the home page claimed stay off the About page so section ids stay unique.
    [[gallery, gal], [stats, st], [team, tm]].forEach((x) => { if (x[1] && home.indexOf(x[1]) > -1) x[0].splice(x[0].indexOf(x[1]), 1); });
    const hasMain = !!(products || services || prices);
    // Home CTA drives to the booking/reserve/order/quote page when there is one, else the shop or contact.
    if (cta) {
      cta.link = bk ? ('#/' + bk.path) : (isShop && hasMain ? ('#/' + mainPath) : '#/contact');
      cta.button = b.bookLabel;
      cta.variant = v3Look('cta', V3_LOOKS.cta[fam]);
      if (cta.variant === 'split' && !hasPhoto(cta)) cta.variant = 'band';
      // Only what the owner told us: licensed and/or insured leads the trades call to action.
      // With the trust strip on the page it already says so: said once, not three times.
      if (fam === 'trades' && !trust && (b.licensed || b.insured) && !/licensed|insured/i.test(cta.text || '')) cta.text = (b.licensed && b.insured ? 'Licensed and insured. ' : b.licensed ? 'Fully licensed. ' : 'Fully insured. ') + (cta.text || 'Tell us about the job.');
    }
    const P = {};
    P.home = { id: 'pg-home', path: '', title: 'Home', nav: true, sections: home };

    // ----- MAIN: Shop / Menu / Services (full catalog + its own CTA) -----
    const mainSection = products || services || prices;
    if (mainSection) {
      const mainSecs = [];
      mainSecs.push(mk('pagehead', { title: mainLabel, text: v3FlavorPick(isShop ? V3_COPY.shopHead : (isFood ? V3_COPY.menuHead : V3_COPY.servicesHead)), emoji: '' }));
      if (mainSection.type === 'services') mainSection.variant = v3Look('services', V3_LOOKS.mainList[fam]);
      mainSecs.push(mainSection);
      if (prices && prices !== mainSection) mainSecs.push(prices);
      const mcta = isShop ? V3_COPY.shopCta : ctaPool(L.ctaKind);
      mainSecs.push(mk('cta', { variant: 'band', title: v3FlavorPick(mcta.title), text: v3FlavorPick(mcta.text), button: b.bookLabel, link: isShop ? '#/contact' : actLink, emoji: '' }));
      P.main = { id: 'pg-main', path: mainPath, title: mainLabel, nav: true, sections: mainSecs };
    }

    // ----- BOOK / RESERVE / ORDER / QUOTE: a real request form (→ owner's inbox), by business type -----
    if (bk) {
      const svcNames = (((services && services.items) || (prices && prices.items) || [])).map((it) => ({ name: it.name || it.title || '' })).filter((x) => x.name);
      const bsecs = [
        mk('pagehead', { title: bk.head, text: bk.sub, emoji: '' }),
        (b.bookingUrl && WSENGINE.bookingEmbedOk(b.bookingUrl))
          ? mk('embed', { title: bk.head, text: '', url: b.bookingUrl, height: '720' })
          : mk('booking', { variant: bk.mode, title: '', text: '', button: bk.btn, services: svcNames, success: bk.ok }),
      ];
      P.book = { id: 'pg-book', path: bk.path, title: bk.title, nav: true, sections: bsecs };
    }

    // ----- ABOUT: always present (story + any team/stats/gallery) so every site has a real About page -----
    const aboutSecs = [mk('pagehead', { title: 'About ' + (b.name || 'us'), text: (sc && sc.tagline) || b.tagline || '', emoji: '' })];
    // Use the generated intro here only if the home page didn't already claim it (no shared section objects / duplicate ids).
    if (intro && !homeUsedIntro) aboutSecs.push(intro);
    else aboutSecs.push(mk('intro', { variant: 'center', text: b.about || (sc && sc.about) || ('About ' + (b.name || 'us') + ' and what we do.'), emoji: '' }));
    stats.forEach((s) => aboutSecs.push(s));
    team.forEach((s) => aboutSecs.push(s));
    gallery.forEach((s) => aboutSecs.push(s));
    beforeafter.forEach((s) => aboutSecs.push(s));
    const _ac = isShop ? V3_COPY.aboutCta : ctaPool(L.ctaKind, true);
    aboutSecs.push(mk('cta', { variant: 'band', title: v3FlavorPick(_ac.title), text: v3FlavorPick(_ac.text), button: b.bookLabel, link: actLink, emoji: '' }));
    P.about = { id: 'pg-about', path: 'about', title: 'About', nav: true, sections: aboutSecs };

    // ----- CONTACT: form (to inbox), visit (hours/map), faq -----
    const contactSecs = [];
    const chText = b.city ? v3FlavorPick(V3_COPY.contactHead.textCity).replace('CITY', v3City(b)) : v3FlavorPick(V3_COPY.contactHead.textNoCity);
    contactSecs.push(mk('pagehead', { title: v3FlavorPick(V3_COPY.contactHead.title), text: chText, emoji: '' }));
    contactSecs.push(mk('contact', { showPhone: true, title: v3FlavorPick(V3_COPY.formTitle), text: v3FlavorPick(V3_COPY.formText), success: v3FlavorPick(V3_COPY.formSuccess) }));
    if (visit && hasReach) { if (b.address) visit.variant = 'map'; visit.title = (visitHome && visitHome.title) || v3VisitTitle(fam, L.act, b, cat); if (visitEb) visit.eyebrow = visitEb; contactSecs.push(visit); }
    if (faq) { faq.variant = faqVar((faq.items || []).length); contactSecs.push(faq); }
    P.contact = { id: 'pg-contact', path: 'contact', title: 'Contact', nav: true, sections: contactSecs };

    site.pages = (V3_PAGE_ORDER[fam] || V3_PAGE_ORDER.pro).map((k) => P[k]).filter(Boolean);
    site.sections = home.slice();
  } catch (e) {}
  return site;
}

// ── AI-written copy (Gemini) for real /create generations ──
// One call per new site, in parallel with the photo lookups, with a hard time limit: anything slow, missing,
// over the monthly cap or failing the checks below falls back to the template copy for that field only.
// The AI only rewords: the business name, phone, address, prices, service names and section structure never
// come from it. Examples (/example) stay on the template copy, so they never spend AI calls.
const V3_AI_MODEL = 'gemini-2.5-flash';
const V3_AI_MS = 5000;
const V3_AI_RULES = [
  'You write the words for one small local business website, in the owner’s own voice: plain, warm, concrete and specific to this business. Use ONLY the facts given. Never invent anything: no prices, numbers, years, durations, opening hours, staff names, awards, certifications, guarantees, warranties, "24/7", emergency or same-day availability, "free" offers, and no superlatives such as best, #1, leading, top-rated or finest. Mention licensed or insured only if the facts say true. US English with natural contractions; no exclamation marks, no emoji, no markdown, no HTML. Keep every service name exactly as given. Review snippets show what customers value: reflect their themes but never quote them, their numbers or their names.',
  'Good lines are specific, concrete and benefit-led, and sound like the owner talking to a neighbor. Bad lines are generic filler any business could use.',
  'Good: "We pick up the phone and show up when we say." / "Leaks traced and fixed, with the price agreed first." / "Bread baked overnight, on the shelf by morning." / "Your books done, explained in plain English."',
  'Bad: "Plumbing repairs you can count on." / "Quality solutions for all your baking needs." / "Look no further for top-notch, trusted service." / "We pride ourselves on being second to none."',
  'Never use: you can count on, quality service, trusted, solutions, one-stop, look no further, top-notch, second to none, we pride ourselves, all your … needs, wide range, various.',
  'Fields. taglines: 3 different candidates, 4–9 words each; never the business name; leave the city out unless it reads naturally; build on what makes them different when the facts give it; never a light rewording of the draft tagline. intro: 2–3 sentences in the owner’s voice ("we") weaving together what makes them different, where they work and what they do. about: 3–4 sentences telling their story from the facts. services: exactly one concrete sentence per service saying what’s included or what the customer gets; no second sentence, no filler. why: only as many as counts.why, a short title and one sentence each, about things the facts or the kind of business support. faq: answer the draft questions in the same order (you may reword a question slightly); direct, useful answers that never promise specifics the facts don’t give (say "Call us and we’ll explain" instead). cta: a short, specific title and one sentence. Stay within the limits; shorter is better.',
].join('\n');
const V3_AI_SCHEMA = { type: 'OBJECT', properties: {
  taglines: { type: 'ARRAY', items: { type: 'STRING' } }, intro: { type: 'STRING' }, about: { type: 'STRING' },
  services: { type: 'ARRAY', items: { type: 'OBJECT', properties: { name: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['name', 'text'] } },
  why: { type: 'ARRAY', items: { type: 'OBJECT', properties: { title: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['title', 'text'] } },
  faq: { type: 'ARRAY', items: { type: 'OBJECT', properties: { q: { type: 'STRING' }, a: { type: 'STRING' } }, required: ['q', 'a'] } },
  cta: { type: 'OBJECT', properties: { title: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['title', 'text'] },
}, required: ['taglines', 'intro', 'services', 'why', 'faq', 'cta', 'about'] };
// Hard caps (checked) and the smaller limits the model is asked for (keeps the answer around 900 tokens).
const V3_AI_CAPS = { tagline: 70, intro: 320, about: 600, svc: 120, whyT: 40, whyX: 140, q: 120, a: 240, ctaT: 40, ctaX: 140 };
const V3_AI_ASK = { taglineWords: '4-9', intro: 280, about: 450, serviceText: 110, whyTitle: 36, whyText: 120, faqQuestion: 100, faqAnswer: 200, ctaTitle: 36, ctaText: 110 };
const V3_AI_BANNED = /guarantee|warrant|certif|accredit|award|#\s?1\b|number one|\bbest\b|\bfinest\b|\bgreatest\b|\bcheapest\b|\bleading\b|top.rated|world.class|unbeatable|unmatched|unrivaled|\bpremier\b|24\s?\/\s?7|round.the.clock|same.day|\bemergenc|\blowest\b|\bhighest\b|\bexperts?\b/i;
// Filler any business could say: an AI field with one of these falls back to the template.
const V3_AI_FILLER = /you can count on|count on us|quality (service|work|workmanship|care)|\btrusted\b|\bsolutions?\b|one.stop|look no further|top.notch|second to none|pride ourselves|all (of )?your [a-z ]{0,24}needs|wide (range|variety|selection)|\bvarious\b|hassle.free/i;
function v3AiKeys(env) { try { if (typeof geminiKeys === 'function') return geminiKeys(env); } catch (e) {} return env && env.GEMINI_API_KEY ? String(env.GEMINI_API_KEY).split(',').map(function (k) { return k.trim(); }).filter(Boolean) : []; }
function v3AiCap(env) { const n = parseInt(env && env.AI_MONTHLY_CAP, 10); return isNaN(n) || n < 0 ? 3000 : n; }
// Count one call against the monthly cap (ai:count:YYYY-MM) before making it. No KV, no counter, no calls.
async function v3AiSpend(env) {
  if (!env || !env.KV) return false;
  try { const k = 'ai:count:' + new Date().toISOString().slice(0, 7); const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= v3AiCap(env)) return false; await env.KV.put(k, String(n + 1), { expirationTtl: 40 * 86400 }); return true; } catch (e) { return false; }
}
// The facts the AI may use. The city as said in a sentence, the other towns. Review snippets only from a linked Google listing.
function v3AiFacts(biz, sc, types) {
  const yrs = v3Years(biz);
  return {
    name: biz.name, type: biz.type, category: sc.category, family: sc.labels && sc.labels.family, city: v3City(biz), towns: v3Nearby(biz),
    whatMakesUsDifferent: biz.unique || '', yearStarted: biz.founded || '', yearsInBusiness: yrs >= 1 ? yrs : '', licensed: !!biz.licensed, insured: !!biz.insured,
    ownerTagline: biz.tagline || '', ownerAbout: biz.about || '',
    services: (biz.services || []).filter(function (s) { return s.name; }).map(function (s) { return { name: s.name, ownerText: s.desc || '' }; }),
    reviewSnippets: biz.googlePlaceId ? (biz.reviews || []).filter(function (r) { return r && r.quote; }).slice(0, 5).map(function (r) { return String(r.quote).replace(/\s+/g, ' ').trim().slice(0, 200); }) : [],
    sections: types,
  };
}
// A one-paragraph brief: who they are, where, since when and the owner's own differentiator.
function v3AiBrief(f) {
  const where = f.city ? ' in ' + f.city + (f.towns.length ? ' (also working in ' + v3And(f.towns.slice(0, 4)) + ')' : '') : (f.towns.length ? ' working in ' + v3And(f.towns.slice(0, 4)) : '');
  const cred = f.licensed && f.insured ? 'licensed and insured' : f.licensed ? 'licensed' : f.insured ? 'insured' : '';
  return [f.name + ' is a ' + String(f.type || 'local business').toLowerCase() + where + '.', f.yearStarted ? 'In business since ' + f.yearStarted + (f.yearsInBusiness ? ' (' + f.yearsInBusiness + ' years).' : '.') : '', cred ? 'They are ' + cred + '.' : '', f.whatMakesUsDifferent ? 'In the owner’s words, what makes them different: "' + f.whatMakesUsDifferent + '". Build the tagline and intro around this.' : 'The owner didn’t say what makes them different: be concrete about the work itself.', 'Write so a neighbor would believe the owner said it.'].filter(Boolean).join(' ');
}
function v3AiNorm(s) { return v3Words(s).replace(/ /g, ''); }
// Bigram (Dice) similarity of two lines, 0..1, ignoring case, spaces and punctuation.
function v3AiSim(a, b) {
  a = v3AiNorm(a); b = v3AiNorm(b);
  if (a.length < 2 || b.length < 2) return 0;
  const g = function (x) { const m = {}; for (let i = 0; i < x.length - 1; i++) { const k = x.substr(i, 2); m[k] = (m[k] || 0) + 1; } return m; };
  const A = g(a), B = g(b); let n = 0; Object.keys(A).forEach(function (k) { n += Math.min(A[k], B[k] || 0); });
  return 2 * n / (a.length + b.length - 2);
}
function v3AiSentences(s) { return String(s || '').split(/(?<=[.!?…])\s+(?=[A-Z0-9“"‘'])/).filter(Boolean).length; }
// One field from the AI → { v: clean text } or { r: short reason } when it breaks a rule (the template text is kept
// for that field). Only digits that appear in the owner's own facts (and the years since the founding year) are allowed.
// kind: 'tagline' (4–9 words, not the name, not the template), 'svc' (one sentence), 'long' (whole sentences kept
// when over the cap), 'intro' (long, at most 3 sentences).
function v3AiCheck(x, cap, ctx, kind) {
  let s = String(x == null ? '' : x).replace(/<[^>]*>/g, ' ').replace(/\*\*|__|[*_`#>~]|\]\([^)]*\)|[\[\]]/g, '').replace(/\s+/g, ' ').trim();
  if (ctx.cityFull && ctx.city && ctx.cityFull !== ctx.city) s = s.split(ctx.cityFull).join(ctx.city);
  if (!s) return { r: 'empty' };
  if (s.length > cap && (kind === 'long' || kind === 'intro')) { const cut = s.slice(0, cap + 1).match(/^.*[.?…](?=\s)/); if (cut && cut[0].length >= cap * 0.4) s = cut[0]; }
  if (s.length > cap) return { r: 'long' };
  if (/!|[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(s)) return { r: 'symbol' };
  if (V3_AI_BANNED.test(s)) return { r: 'claim' };
  if (V3_AI_FILLER.test(s)) return { r: 'filler' };
  if (/\bfree\b/i.test(s) && !/\bfree\b/i.test(ctx.text)) return { r: 'free' };
  if (/licen[sc]/i.test(s) && !ctx.licensed) return { r: 'licensed' };
  if (/\binsur/i.test(s) && !ctx.insured) return { r: 'insured' };
  if ((s.match(/\d+/g) || []).some(function (d) { return ctx.digits.indexOf(d) < 0; })) return { r: 'number' };
  if (kind === 'svc' && v3AiSentences(s) > 1) return { r: 'sentences' };
  if (kind === 'intro' && v3AiSentences(s) > 3) return { r: 'sentences' };
  if (kind === 'tagline') {
    const w = s.split(/\s+/).length, n = v3AiNorm(s);
    if (w < 4 || w > 9) return { r: 'words' };
    if ((ctx.name && n.indexOf(ctx.name) > -1) || ctx.nameWords.some(function (x) { return new RegExp('\\b' + x + '\\b').test(v3Words(s)); })) return { r: 'name' };
    if (ctx.tpl.some(function (t) { const k = v3AiNorm(t); return (k.length >= 10 && n.indexOf(k) > -1) || v3AiSim(s, t) > 0.7; })) return { r: 'template' };
  }
  return { v: s };
}
function v3AiText(x, cap, ctx, kind) { return v3AiCheck(x, cap, ctx, kind).v || ''; }
// Ask Gemini once (a second key only if the first is rate-limited). Returns the checked fields plus `rejected`
// (short "field:reason" codes, kept on the site as copyRejected), { fail } when the call failed or timed out,
// or null when there was no call (no key, cap reached).
async function v3AiCopy(env, facts, draft) {
  const keys = v3AiKeys(env);
  if (!keys.length || !(await v3AiSpend(env))) return null;
  const t0 = Date.now();
  const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  let timer = 0;
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: V3_AI_RULES }] },
    contents: [{ role: 'user', parts: [{ text: JSON.stringify({ brief: v3AiBrief(facts), facts: facts, draft: draft.copy, limits: V3_AI_ASK, counts: { taglines: 3, why: (draft.copy.why || []).length, faq: (draft.copy.faq || []).length } }) }] }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: V3_AI_SCHEMA, temperature: 0.7, maxOutputTokens: 1024, thinkingConfig: { thinkingBudget: 0 } },
  });
  let fail = 'error';
  const call = async function () {
    for (let i = 0; i < Math.min(2, keys.length); i++) {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + V3_AI_MODEL + ':generateContent', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': keys[i] }, body: body, signal: ctrl ? ctrl.signal : undefined });
      if (r && r.ok) return await r.json();
      if (r && r.status === 429) fail = 'busy';
      if (!r || (r.status !== 429 && r.status < 500)) return null;
    }
    return null;
  };
  // The time limit holds even if the fetch ignores the abort signal.
  const limit = new Promise(function (res) { timer = setTimeout(function () { fail = 'timeout'; try { if (ctrl) ctrl.abort(); } catch (e) {} res(null); }, Math.min(V3_AI_MS, parseInt(env.AI_TIMEOUT_MS, 10) || V3_AI_MS)); });
  let j = null;
  try { j = await Promise.race([call().catch(function () { return null; }), limit]); } catch (e) { j = null; } finally { if (timer) clearTimeout(timer); }
  if (!j) return { fail: fail, ms: Date.now() - t0 };
  let out; try { out = JSON.parse(((((j.candidates || [])[0] || {}).content || {}).parts || []).map(function (p) { return p.text || ''; }).join('')); } catch (e) { return { fail: 'parse', ms: Date.now() - t0 }; }
  if (!out || typeof out !== 'object') return { fail: 'parse', ms: Date.now() - t0 };
  const ctxT = JSON.stringify([facts.name, facts.type, facts.city, facts.towns, facts.whatMakesUsDifferent, facts.yearStarted, facts.ownerTagline, facts.ownerAbout, facts.services, draft.phone || '', draft.address || '', draft.prices || []]);
  const typeW = v3Words(facts.type).split(' ');
  const ctx = {
    text: ctxT, licensed: facts.licensed, insured: facts.insured, digits: (ctxT.match(/\d+/g) || []).concat(facts.yearsInBusiness ? [String(facts.yearsInBusiness)] : []),
    city: facts.city, cityFull: String(draft.cityFull || '').trim(), name: v3AiNorm(facts.name), tpl: [draft.copy.tagline].concat(draft.taglinePool || []).filter(Boolean),
    nameWords: v3Words(facts.name).split(' ').filter(function (w) { return w.length >= 4 && !V3_VAGUE_WORD.test(w) && !/^(sons|brothers|bros|daughters|and)$/.test(w) && !typeW.some(function (t) { return t.length >= 4 && t.slice(0, 5) === w.slice(0, 5); }); }),
  };
  const C = V3_AI_CAPS, rej = [];
  const T = function (key, x, n, kind) { const c = v3AiCheck(x, n, ctx, kind); if (!c.v) rej.push(key + ':' + c.r); return c.v || ''; };
  const res = { ms: Date.now() - t0, rejected: rej };
  // Tagline: the first of the candidates that passes.
  const cands = (Array.isArray(out.taglines) ? out.taglines : []).concat(out.tagline ? [out.tagline] : []).slice(0, 4);
  const why0 = [];
  for (let i = 0; i < cands.length && !res.tagline; i++) { const c = v3AiCheck(cands[i], C.tagline, ctx, 'tagline'); if (c.v) res.tagline = c.v; else why0.push(c.r); }
  if (!res.tagline) rej.push('tagline:' + (why0[0] || 'empty'));
  const intro = T('intro', out.intro, C.intro, 'intro'); if (intro) res.intro = intro;
  const about = T('about', out.about, C.about, 'long'); if (about) res.about = about;
  const sv = {}; (Array.isArray(out.services) ? out.services : []).forEach(function (s, i) { const v = s && T('services.' + i, s.text, C.svc, 'svc'); if (v && s.name) sv[String(s.name).trim().toLowerCase()] = v; }); if (Object.keys(sv).length) res.services = sv;
  const why = (Array.isArray(out.why) ? out.why : []).slice(0, Math.max((draft.copy.why || []).length, 2)).map(function (w, i) { const a = w && T('why.' + i, w.title, C.whyT), b = a && T('why.' + i, w.text, C.whyX); return a && b ? { title: a, text: b } : null; }).filter(Boolean); if (why.length) res.why = why;
  // FAQ, answer by answer: one that breaks a rule keeps the template's question and answer in its place.
  const df = draft.copy.faq || [], nf = df.length, af = Array.isArray(out.faq) ? out.faq : [];
  if (nf) {
    let n = 0;
    const faq = df.map(function (d, i) { const f = af[i], a = f && T('faq.' + i, f.q, C.q), b = a && T('faq.' + i, f.a, C.a, 'long'); if (a && b && !/\?$/.test(a)) rej.push('faq.' + i + ':question'); if (a && b && /\?$/.test(a)) { n++; return { q: a, a: b }; } return { q: d.q, a: d.a }; });
    if (n) res.faq = faq;
  }
  if (out.cta) { const a = T('cta', out.cta.title, C.ctaT), b = a && T('cta', out.cta.text, C.ctaX); if (a && b) res.cta = { title: a, text: b }; }
  return res;
}
// Put the checked AI fields into the finished pages. Owner-written text, owner-answer why points, names, prices,
// links and the section structure stay as they are. Returns the fields that came from the AI; a field that had
// nowhere to go is noted in ai.rejected ("intro:no_section", "why:no_slots").
function v3AiApply(site, ai, biz, starterFaq) {
  const used = [];
  if (!ai || ai.fail) return used;
  const rej = ai.rejected || (ai.rejected = []);
  const all = (site.pages || []).flatMap(function (p) { return p.sections || []; });
  const home = (site.pages && site.pages[0] && site.pages[0].sections) || [];
  const about = ((site.pages || []).find(function (p) { return p.path === 'about'; }) || { sections: [] }).sections;
  if (ai.tagline && !biz.tagline) { const h = home.find(function (s) { return s.type === 'hero'; }); if (h) { h.tagline = ai.tagline; used.push('tagline'); } }
  if (ai.intro) { const i = home.find(function (s) { return s.type === 'intro'; }); if (i && !(biz.about && i.text === biz.about)) { i.text = v3Dedupe(ai.intro); used.push('intro'); } else rej.push(i ? 'intro:owner' : 'intro:no_section'); }
  if (ai.about && !biz.about) { const i = about.find(function (s) { return s.type === 'intro'; }); if (i) { const u = biz.unique ? v3Sentence(biz.unique) : ''; i.text = v3Dedupe(u && ai.about.indexOf(biz.unique) < 0 && v3Overlap(u, ai.about) < 0.5 ? u + ' ' + ai.about : ai.about); used.push('about'); } }
  if (ai.services) {
    let n = 0; const own = {}; (biz.services || []).forEach(function (s) { if (s.desc) own[String(s.name).trim().toLowerCase()] = 1; });
    all.filter(function (s) { return s.type === 'services'; }).forEach(function (s) { (s.items || []).forEach(function (it) { const k = String(it.name || '').trim().toLowerCase(); if (ai.services[k] && !own[k]) { it.text = ai.services[k]; n++; } }); });
    if (n) used.push('services');
  }
  if (ai.why) { const w = all.find(function (s) { return s.type === 'why'; }); let i = 0; if (w) (w.items || []).forEach(function (it) { if (it.source === 'starter' && ai.why[i]) { it.title = ai.why[i].title; it.text = ai.why[i].text; it.source = 'ai'; i++; } }); if (i) used.push('why'); else rej.push(w ? 'why:no_slots' : 'why:no_section'); }
  if (ai.faq && starterFaq) {
    let n = 0; const hasTrust = home.some(function (s) { return s.type === 'trust'; });
    all.filter(function (s) { return s.type === 'faq'; }).forEach(function (f) { const k = Math.max((f.items || []).length, 1); f.items = (home.indexOf(f) > -1 ? v3TrustFaq(ai.faq, hasTrust) : ai.faq).slice(0, k).map(function (x) { return { q: x.q, a: x.a }; }); n++; });
    if (n) used.push('faq'); else rej.push('faq:no_section');
  }
  if (ai.cta) { const c = home.find(function (s) { return s.type === 'cta'; }); if (c) { const pre = (String(c.text || '').match(/^(Licensed and insured\. |Fully licensed\. |Fully insured\. )/) || [''])[0]; c.title = ai.cta.title; c.text = pre + ai.cta.text; used.push('cta'); } }
  return used;
}
async function doCreate(request, env) {
  // Per-IP limits (20 an hour, 60 a day). Test servers apply them only to requests that name a test IP.
  if (env.WS_TEST_MODE !== '1' || request.headers.get('x-ws-test-ip')) {
    const ip = wsClientIp(request, env), d = new Date().toISOString();
    if (!(await wsRate(env, 'crrate:h:' + d.slice(0, 13) + ':' + ip, 20, 3600)) || !(await wsRate(env, 'crrate:d:' + d.slice(0, 10) + ':' + ip, 60, 86400))) return new Response(JSON.stringify({ error: 'You have made a lot of sites in a short time. Please try again in a little while.' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }
  let body; try { body = await request.json(); } catch { return fail('Invalid request'); }
  const _t0 = Date.now();
  try {
    const r = await buildV3Site(body || {}, env, { ai: true });
    const site = r.site, siteId = r.siteId, html = r.html;
    const formKey = await siteKey(siteId, env);
    try { if (env.KV) await env.KV.put('site:' + siteId, JSON.stringify(site), { expirationTtl: 60 * 60 * 24 * 30 }); } catch (e) {}
    try { if (env.KV) { const _sgC = await env.KV.get('stat:sitesgrown'); if (_sgC !== null) await env.KV.put('stat:sitesgrown', String((parseInt(_sgC, 10) || 0) + 1)); } } catch (e) {}
    try { const _s = await getSession(request, env); const _ty = String(site.biz.type || ''); if (env.UNSPLASH_ACCESS_KEY) wsCount(env, 'unsplash_gen', wsHour(), request); await logEvent(request, env, 'generate', { site: siteId, email: _s && _s.email, bizType: _ty, category: v3StarterBase(_ty).category || 'generic', props: { look: /^(light|dark|colorful)$/.test(String(body.look || '')) ? String(body.look) : 'default', google: site.biz.googlePlaceId ? 1 : 0, shop: r.isShop ? 1 : 0, ms: Date.now() - _t0, ai: site.copySource === 'ai' ? 1 : 0, aiMs: r.aiMs || 0 } }); } catch (e) {}
    return succeed({ html: html, siteId: siteId, formKey: formKey, site: site, inboxUrl: 'https://websprout.app/inbox?site=' + siteId + '&key=' + formKey });
  } catch (e) {
    try { await logEvent(request, env, 'generate_fail', { bizType: String((body && body.type) || ''), props: { err: String((e && e.message) || e).slice(0, 120), ms: Date.now() - _t0 } }); } catch (e2) {}
    return wsErr(e);
  }
}

// Example sites for the landing page, built by the exact same generator customers get.
const EXAMPLE_SITES = [
  { name: 'Fade & Co.', type: 'Barber shop', city: 'Austin', phone: '(512) 555-0142', address: '412 Congress Ave, Austin, TX' },
  { name: 'Rosa Verde', type: 'Mexican restaurant', city: 'San Diego', phone: '(619) 555-0187', address: '2210 India St, San Diego, CA' },
  { name: 'Spotless Pros', type: 'House cleaning', city: 'Denver', phone: '(303) 555-0119' },
  { name: 'Hartley & Reed', type: 'Law firm', city: 'Boston', phone: '(617) 555-0166', address: '88 State St, Boston, MA' },
  { name: 'Still Water Yoga', type: 'Yoga studio', city: 'Portland', phone: '(503) 555-0134' },
  { name: 'Petal & Stem', type: 'Wedding florist', city: 'Charleston', phone: '(843) 555-0171' },
];
async function doExample(request, env) {
  const url = new URL(request.url);
  const i = Math.max(0, Math.min(EXAMPLE_SITES.length - 1, parseInt(url.searchParams.get('i') || '0', 10) || 0));
  // /example?n=<niche slug>: a sample for one of the /for/ business types
  const nk = (url.searchParams.get('n') || '').toLowerCase();
  const niche = nk ? NICHES.find(function (x) { return x.slug === nk; }) : null;
  if (nk && !niche) return new Response('Unknown example', { status: 404 });
  const input = niche ? { name: 'Maple Street ' + niche.name, type: niche.name, city: 'Springfield', phone: '(555) 010-0123' } : Object.assign({}, EXAMPLE_SITES[i]);
  try {
    const r = await buildV3Site(input, env);
    return new Response(r.html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': 'noindex', 'Content-Security-Policy': 'sandbox allow-scripts allow-popups allow-same-origin' } });
  } catch (e) { return new Response('Example unavailable', { status: 500 }); }
}

// Setup's "services & prices" box: one per line (or comma-separated). A trailing price is optional:
// "Skin fade - $30", "Beard trim: 15", "Color from $85+", "Consultation".
function parseServicesText(txt) {
  const raw = String(txt || '').slice(0, 1500);
  const parts = raw.indexOf('\n') > -1 ? raw.split(/\r?\n/) : raw.split(/;|,(?=\s*[^\d\s])/);
  const out = [];
  parts.forEach(function (line) {
    let s = line.replace(/^\s*(?:[-*\u2022\u00b7]|\d+[.)])\s+/, '').replace(/\s+/g, ' ').trim();
    if (!s) return;
    let price = '';
    const m = s.match(/^(.*?)[\s:=|\u2013\u2014-]*(?:from\s+|starting\s+at\s+)?(\$\s?\d[\d,]*(?:\.\d{1,2})?\+?|\d[\d,]*(?:\.\d{1,2})?\+?\s?(?:\$|dollars?|usd)?)\s*(?:\/\s?\w+|per\s+\w+|each|ea)?\s*$/i);
    if (m && m[1].trim() && /[a-z]/i.test(m[1])) {
      s = m[1].replace(/[\s:=|\u2013\u2014-]+$/, '').replace(/\s+(?:from|starting at)$/i, '').trim();
      let p = m[2].replace(/\s+/g, '').replace(/(?:dollars?|usd)$/i, '').replace(/\$$/, '');
      p = p.charAt(0) === '$' ? p : '$' + p;
      price = (/^(?:from|starting)/i.test(m[0].slice(m[1].length).trim()) || /\+$/.test(p)) ? p.replace(/\+$/, '') + '+' : p;
    }
    s = s.replace(/^[\s:=|\u2013\u2014-]+/, '').slice(0, 60).trim();
    if (s && /[a-z0-9]/i.test(s)) out.push({ name: s.charAt(0).toUpperCase() + s.slice(1), desc: '', price: price.slice(0, 20) });
  });
  return out.slice(0, 12);
}

async function buildV3Site(d, env, opts) {
  if (d && !Array.isArray(d.services) && typeof d.servicesText === 'string' && d.servicesText.trim()) {
    d = Object.assign({}, d, { services: parseServicesText(d.servicesText) });
  }
  {
    const _cat0 = v3StarterBase((d.type || '').toString()).category;
    const isShop = !!d.ecommerce || (/shop|store|boutique|retail|e-?commerce|goods|merch/i.test((d.type || '').toString()) && (_cat0 === 'retail' || _cat0 === 'generic'));
    const biz = {
      name: (d.name || '').toString().trim().slice(0, 80) || 'Your Business',
      type: (d.type || '').toString().trim().slice(0, 60) || 'Local Business',
      city: (d.city || '').toString().slice(0, 80),
      address: (d.address || '').toString().slice(0, 160),
      tagline: (d.tagline || '').toString().slice(0, 200),
      phone: (d.phone || '').toString().slice(0, 40),
      instagram: (d.instagram || '').toString().replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 40),
      bookingUrl: /^https:\/\//.test(String(d.bookingUrl || '')) ? String(d.bookingUrl).slice(0, 300) : '',
      founded: v3Year(d.founded),
      about: (d.about || '').toString().slice(0, 400),
      unique: v3Clean(d.unique, 200),
      licensed: d.licensed === true,
      insured: d.insured === true,
      towns: v3Towns(d.towns),
      googlePlaceId: /^[A-Za-z0-9_-]{10,300}$/.test(String(d.googlePlaceId || '')) ? String(d.googlePlaceId) : '',
      googleName: (d.googleName || '').toString().slice(0, 80),
      bookLabel: isShop ? 'Shop now' : 'Get in touch',
      bookShort: isShop ? 'Shop' : 'Contact',
      walkIns: true,
      hours: Array.isArray(d.hours) ? d.hours.slice(0, 7).map(function (h) { h = h || {}; const tm = function (x) { return /^\d{2}:\d{2}$/.test(String(x || '')) ? String(x) : ''; }; const o = { d: String(h.d || '').slice(0, 3) }; if (tm(h.open) && tm(h.close)) { o.open = tm(h.open); o.close = tm(h.close); } return o; }) : [],
      services: Array.isArray(d.services) ? d.services.slice(0, 12).map(function (s) { return { name: (s.name || '').toString().slice(0, 60), desc: (s.desc || s.specialty || '').toString().slice(0, 160), price: (s.price || '').toString().slice(0, 20) }; }) : [],
      team: Array.isArray(d.team) ? d.team.slice(0, 12).map(function (t) { return { name: (t.name || '').toString().slice(0, 60), specialty: (t.role || t.specialty || '').toString().slice(0, 80) }; }) : [],
      reviews: Array.isArray(d.reviews) ? d.reviews.slice(0, 12).map(function (r) { return { quote: (r.quote || '').toString().slice(0, 240), name: (r.name || '').toString().slice(0, 60) }; }) : [],
    };
    // One seed per business: the same name, type and city always get the same copy and layout.
    const seed = String(d.seed || [biz.name, biz.type, biz.city].join('|')).toLowerCase().slice(0, 300);
    const sc = v3WithSeed(seed + '|copy', function () { return v3Starter(biz.type, biz); });
    if (isShop) sc.labels = v3Labels(sc.category, biz.type, true);
    biz.bookLabel = sc.labels.bookLabel; biz.bookShort = sc.labels.bookShort;
    // Look picked on the first step: Light, Dark or Colorful (otherwise the category default).
    const look = /^(light|dark|colorful)$/.test(String(d.look || '')) ? String(d.look) : '';
    let lookPal = '';
    const scKey = /^[wb]_/.test(sc.palette || '') ? sc.palette.slice(2) : 'mono';
    if (look === 'light') lookPal = 'w_' + scKey;
    else if (look === 'dark') lookPal = 'b_' + scKey;
    else if (look === 'colorful') lookPal = v3WithSeed(seed + '|look', function () { return v3FlavorPick(V3_COLORFUL[sc.category] || V3_COLORFUL.generic); });
    if (lookPal && !WSENGINE.palettes.some((p) => p.id === lookPal)) lookPal = '';
    const palette = (d.palette || '').toString() || lookPal || sc.palette || 'w_mono';
    const typeset = (d.typeset || '').toString() || sc.typeset || 'bold';
    const emojiStyle = (d.emojiStyle || 'color').toString();
    const knownType = /barber|salon|tattoo|groom|nail|spa|beauty|bak|cafe|coffee|food|restaurant|kitchen|donut|truck|lawn|landscap|garden|clean|pressure|pool|window|pest|gutter|handy|plumb|electric|hvac|heating|roof|paint|lock|appliance|junk|haul|tailor|alteration|daycare|child|preschool|tutor|music|piano|guitar|flor|flower|massage|yoga|pilates|car ?wash|detail|walk|sitter/i.test(biz.type);
    const has = function (a) { return Array.isArray(a) && a.length; };
    const site = { biz: biz, palette: palette, typeset: typeset, emojiStyle: emojiStyle, iconStyle: 'line', photos: {}, sections: [], statsApi: 'https://websprout.app/api/place' };
    const add = function (type, ov) { site.sections.push(Object.assign({ id: type + '-' + WSENGINE.uid(), type: type }, WSENGINE.sections[type].create(site), ov || {})); };
    // Fill a finished-feeling site from deterministic, type-aware starter content. The owner edits any of it.
    const heroTag = biz.tagline || sc.tagline || '';
    // The starter story opens with what the owner says makes them different, and ends with the year they started
    // and the towns they serve, when they told us. An About the owner wrote is used exactly as written.
    const aboutText = biz.about || [v3Sentence(biz.unique), sc.about || '', biz.founded ? (biz.city && !v3ServeLine(biz) ? 'Serving ' + v3City(biz) + ' since ' + biz.founded + '.' : 'In business since ' + biz.founded + '.') : '', v3ServeLine(biz)].filter(Boolean).join(' ');
    if (d.announce) add('announce', { text: String(d.announce).slice(0, 120), emoji: knownType ? '1f389' : '' });
    add('hero', { variant: 'photo', title: '', tagline: heroTag, status: false, emoji: '' });
    if (aboutText) add('intro', { variant: 'center', text: aboutText, emoji: '' });
    if (isShop) {
      const _prods = (Array.isArray(d.products) ? d.products.slice(0, 48).map(function (p) { return { name: (p.name || '').toString().slice(0, 80), price: (p.price || '').toString().slice(0, 20), desc: (p.desc || '').toString().slice(0, 160), emoji: (p.emoji || '').toString().slice(0, 12), photo: '' }; }) : []);
      if (_prods.length) add('products', { variant: 'grid', title: (d.shopTitle ? String(d.shopTitle).slice(0, 60) : 'Shop'), items: _prods });
      else if (sc.services && sc.services.length) add('services', { variant: 'grid', title: sc.servicesTitle || 'Why shop with us', items: sc.services.map(function (s) { return { emoji: s[2] || '', name: s[0], text: s[1], from: '' }; }) });
    }
    else if (has(biz.services)) {
      const _norm = function (x) { return String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/s\b/g, '').trim(); };
      const _starter = (sc.servicePool || sc.services || []).map(function (s) { return { k: _norm(s[0]), text: s[1], emoji: s[2] || '' }; });
      let _recs = []; try { _recs = WSENGINE.emojiRecsFor(biz.type) || []; } catch (e) {}
      const _items = biz.services.filter(function (x) { return x.name; }).map(function (x, i) {
        const k = _norm(x.name);
        const hit = _starter.find(function (s) { return s.k && (s.k === k || (k.length > 3 && (s.k.indexOf(k) > -1 || k.indexOf(s.k) > -1))); });
        return { emoji: knownType ? ((hit && hit.emoji) || _recs[(i + 2) % (_recs.length || 1)] || '') : '', name: x.name, text: x.desc || (hit ? hit.text : ''), from: x.price || '' };
      });
      add('services', { variant: 'grid', title: sc.servicesTitle || 'What we do', items: _items });
    }
    else if (sc.services && sc.services.length) { add('services', { variant: 'grid', title: sc.servicesTitle || 'What we do', items: sc.services.map(function (s) { return { emoji: s[2] || '', name: s[0], text: s[1], from: '' }; }) }); }
    if (biz.googlePlaceId) add('reviews', { variant: 'google', title: 'What people say' });
    else if (has(biz.reviews)) add('reviews', { variant: 'wall' });
    // Numbers only from real data (years since the founding year the owner gave, the linked Google listing's
    // rating and review count). Never a starter number: with fewer than two real figures there is no band.
    {
      const _now = new Date().getFullYear(), _f = parseInt(biz.founded, 10);
      const _yrs = /^\d{4}$/.test(biz.founded) && _f > 1800 && _f <= _now ? _now - _f : 0;
      const _rn = parseFloat(d.rating), _cn = parseInt(d.count, 10);
      const _rt = /^\s*\d+(\.\d+)?\s*$/.test(String(d.rating)) && _rn >= 1 && _rn <= 5 ? _rn : 0;
      const _ct = /^\s*\d+\s*$/.test(String(d.count)) && _cn >= 5 ? _cn : 0;
      const _st = [];
      if (_yrs >= 2) _st.push({ label: 'Years in business', source: 'years', value: String(_yrs), suffix: '', emoji: '' });
      if (biz.googlePlaceId && _rt) _st.push({ label: 'Google rating', source: 'google_rating', value: _rt.toFixed(1), suffix: '★', emoji: '' });
      if (biz.googlePlaceId && _rt && _ct) _st.push({ label: 'Google reviews', source: 'google_reviews', value: String(_ct), suffix: '', emoji: '' });
      if (_st.length >= 2) add('stats', { variant: 'row', title: '', items: _st });
      // A linked listing's real rating rides on biz, where the trust badges read it.
      if (biz.googlePlaceId && _rt) { biz.googleRating = _rt; if (_ct) biz.googleReviews = _ct; }
    }
    // The team, only when the owner listed real people.
    if (has(biz.team) && biz.team.some(function (x) { return x.name; })) add('team', { variant: 'rows', title: '', items: biz.team.filter(function (x) { return x.name; }).map(function (x) { return { name: x.name, text: x.specialty }; }) });
    // Every question has a real answer: owner questions without one are left out, starter answers fit the owner's facts.
    const _ofaq = has(d.faq) ? d.faq.slice(0, 10).map(function (q) { q = q || {}; return { q: (q.q || '').toString().trim().slice(0, 160), a: (q.a || '').toString().trim().slice(0, 400) }; }).filter(function (q) { return q.q && q.a; }) : [];
    if (_ofaq.length) add('faq', { variant: 'accordion', items: _ofaq });
    else if (sc.faq && sc.faq.length) add('faq', { variant: 'accordion', items: sc.faq.map(function (x) { return { q: x[0], a: v3FaqFit(x[0], x[1], biz) }; }) });
    add('cta', isShop
      ? { variant: 'band', title: 'Shop the collection.', text: 'Browse everything and order online.', button: biz.bookLabel, emoji: '' }
      : { variant: 'band', title: sc.ctaTitle || "Let's get started.", text: sc.ctaText || "Reach out and we'll take it from here.", button: biz.bookLabel, emoji: '' });
    add('visit', { variant: 'hours' });
    // Photography (graceful: no keys or any failure → designed gradient hero, no gallery). A linked Google
    // listing supplies the business's own photos for the hero and gallery; Unsplash (searched by type and
    // services) fills any slot Google can't. Both lookups run at once, so linking Google adds no wait.
    // Past the monthly Google cap, Google is skipped entirely. Unsplash fetches spares as each Google slot's backup.
    // AI wording, asked once and in parallel with the photo lookups (real /create generations only).
    const _starterFaq = !_ofaq.length;
    const _aiDraft = { phone: biz.phone, address: biz.address, cityFull: biz.city, taglinePool: sc.taglinePool || [], prices: biz.services.map(function (s) { return s.price; }).filter(Boolean), copy: { tagline: heroTag, intro: aboutText, services: (site.sections.find(function (s) { return s.type === 'services'; }) || { items: [] }).items.map(function (it) { return { name: it.name, text: it.text }; }), why: v3WithSeed(seed + '|whydraft', function () { return v3WhyItems(biz, sc.category, sc.labels.family, !!((biz.towns || []).length && WSENGINE.sections.area && v3ServiceArea(sc.labels.family, sc.category, biz.type, biz)), v3TrustOn(biz, sc.labels.family)); }).filter(function (w) { return w.source === 'starter'; }).map(function (w) { return { title: w.title, text: w.text }; }), faq: _starterFaq ? (sc.faq || []).map(function (x) { return { q: x[0], a: v3FaqFit(x[0], x[1], biz) }; }) : [], cta: { title: sc.ctaTitle || '', text: sc.ctaText || '' } } };
    const _aiP = (opts && opts.ai) ? v3AiCopy(env, v3AiFacts(biz, sc, site.sections.map(function (s) { return s.type; })), _aiDraft).catch(function () { return null; }) : Promise.resolve(null);
    try {
      const _gOn = !!biz.googlePlaceId && (await gphotoLeft(env)) > 0;
      const _found = await Promise.all([
        _gOn ? placePhotoList(biz.googlePlaceId, env, 3000).catch(function () { return null; }) : null,
        unsplashPhotos(v3PhotoQueries(biz, sc), env, _gOn ? 8 : 4, v3PhotoRel(biz, sc)),
      ]);
      const _un = _found[1] || [];
      const _gl = (_found[0] || []).slice(0, 4);
      const _gp = v3GooglePhotos(biz.googlePlaceId, _gl, 4, _un.slice(4 - _gl.length));
      const _pics = _gp.concat(_un).slice(0, 4);
      if (_pics.length) {
        const _h = site.sections.find(function (s) { return s.type === 'hero'; });
        site.photoCredits = {};
        const _cr = function (k, p) {
          site.photos[k] = p.url;
          site.photoCredits[k] = p.source === 'google' ? { name: p.name, link: p.link, source: 'google' } : { name: p.name, link: p.link };
          if (p.fallback) { site.photoFallbacks = site.photoFallbacks || {}; site.photoFallbacks[k] = p.fallback; }
        };
        if (_h) _cr(_h.id + '.photo', _pics[0]);
        if (_pics.length >= 4) {
          const _g = { id: 'gallery-' + WSENGINE.uid(), type: 'gallery', variant: 'strip', title: '' };
          let _gi = site.sections.findIndex(function (s) { return s.type === 'cta'; });
          if (_gi < 0) _gi = site.sections.findIndex(function (s) { return s.type === 'visit'; });
          site.sections.splice(_gi < 0 ? site.sections.length : _gi, 0, _g);
          _cr(_g.id + '.p0', _pics[1]);
          _cr(_g.id + '.p1', _pics[2]);
          _cr(_g.id + '.p2', _pics[3]);
        }
        // Unsplash API guidelines: report each photo actually used (their "download" event). Bounded wait.
        const _used = _pics.slice(0, _pics.length >= 4 ? 4 : 1).map(function (p) { return p.download; }).filter(function (d) { return /^https:\/\/api\.unsplash\.com\/photos\/[A-Za-z0-9_-]+\/download/.test(String(d || '')); });
        if (_used.length) {
          const _ac = (typeof AbortController !== 'undefined') ? new AbortController() : null;
          const _tm = _ac ? setTimeout(function () { try { _ac.abort(); } catch (e) {} }, 1500) : 0;
          try { await Promise.all(_used.map(function (d) { return fetch(d, { headers: { 'Authorization': 'Client-ID ' + env.UNSPLASH_ACCESS_KEY }, signal: _ac ? _ac.signal : undefined }).catch(function () {}); })); } finally { if (_tm) clearTimeout(_tm); }
        }
      }
    } catch (e) {}
    // Assign the site id up front so the contact form can bake its /api/form/<siteId> action.
    const siteId = 'ws' + Math.random().toString(36).slice(2, 9);
    site.siteId = siteId;
    // Build a real multi-page site (Home + Shop/Menu/Services + About + Contact) with cross-page nav.
    v3WithSeed(seed + '|layout', function () { v3Pages(site, sc, isShop); });
    const _ai = await _aiP;
    const _aiUsed = v3AiApply(site, _ai, biz, _starterFaq);
    site.copySource = _aiUsed.length ? 'ai' : 'template';
    if (_aiUsed.length) site.copyFields = _aiUsed;
    // Why AI fields fell back (short codes such as tagline:template, faq.1:claim, intro:no_section, ai:timeout).
    const _rj = _ai ? (_ai.fail ? ['ai:' + _ai.fail] : (_ai.rejected || [])).filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 24) : [];
    if (_rj.length) site.copyRejected = _rj;
    try { site.logoMark = v3WithSeed(seed + '|mark', function () { return v3LogoMark(sc.labels.family, sc.category, biz.type); }); } catch (e) {}
    const html = WSENGINE.renderSite(site, { mode: 'live' });
    return { site: site, siteId: siteId, html: html, isShop: isShop, aiMs: (_ai && _ai.ms) || 0 };
  }
}
