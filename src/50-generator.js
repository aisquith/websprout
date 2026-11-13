function v3StarterBase(type) {
  const t = (type || '').toLowerCase();
  const M = (re) => re.test(t);
  // [name, description, emoji-hex]
  if (M(/barber|barbershop|fade|men.?s grooming/)) return {
    category: 'barber', tagline: 'A sharp cut, every time.',
    about: 'Walk in for a classic cut or a modern fade. We take our time, line things up right, and send you out looking your best.',
    servicesTitle: 'What we do', ctaTitle: 'Ready for a fresh cut?', ctaText: 'Grab a chair and we will take care of the rest.',
    services: [['Haircut', 'A precise cut shaped to how you want to look and feel.', '1f488'], ['Skin Fade', 'Clean, blended fades from the skin up — crisp every time.', '2702'], ['Beard Trim', 'Shaped, lined up and conditioned so it looks intentional.', '1f9d4'], ['Hot Towel Shave', 'A traditional straight-razor shave with a hot-towel finish.', '1fa92']] };
  if (M(/salon|hair studio|stylist|blowout|hairdress/)) return {
    category: 'salon', tagline: 'Hair you will want to show off.',
    about: 'From a trim to a full transformation, we listen first and cut to suit you — your hair, your face, your routine.',
    servicesTitle: 'Services', ctaTitle: 'Let us find your look.', ctaText: 'Book a chair and tell us what you have in mind.',
    services: [['Cut & Style', 'A tailored cut finished exactly how you like to wear it.', '2702'], ['Color', 'Balayage, highlights or a full color, matched to your tone.', '1f3a8'], ['Blowout', 'Smooth, bouncy and ready for whatever is next.', '1f4a8'], ['Treatment', 'A deep conditioning or gloss to bring hair back to life.', '2728']] };
  if (M(/nail|\bspas?\b|day spa|lash|\bwax|esthet|massage|beauty|facial/)) return {
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
  if (M(/restaurant|kitchen|grill|bbq|barbecue|taco|pizza|sushi|diner|eatery|bistro|catering|food truck|cuisine|steakhouse/)) return {
    category: 'restaurant', tagline: 'Food worth coming back for.',
    about: 'Honest cooking made from good ingredients, served by people who are glad you came in. Pull up a seat — we saved you one.',
    servicesTitle: 'Why people come back', ctaTitle: 'Hungry yet?', ctaText: 'Reserve a table or order ahead for pickup.',
    services: [['Made to Order', 'Dishes cooked when you order them, never before.', '1f373'], ['Local Ingredients', 'We source close to home whenever the season allows.', '1f33f'], ['Full Menu', 'Something for everyone, from the regulars to the curious.', '1f37d'], ['Takeout', 'The same kitchen, packed up and ready to go.', '1f963']] };
  if (M(/lawn|landscap|garden|yard|turf|mow|tree service|irrigation/)) return {
    category: 'lawn', tagline: 'The best yard on the block.',
    about: 'We show up when we say we will and treat your yard like it is ours. Dependable work, fair prices, and a lawn you are proud of.',
    servicesTitle: 'What we handle', ctaTitle: 'Want a tidier yard?', ctaText: 'Tell us about your property and we will send a quote.',
    services: [['Mowing', 'Clean, even cuts on a schedule that fits your yard.', '1f33e'], ['Landscaping', 'Beds, plantings and features that lift the whole property.', '1fab4'], ['Cleanups', 'Seasonal leaf, brush and debris hauled away for good.', '1f342'], ['Trimming', 'Hedges, edges and trees kept sharp and healthy.', '1f333']] };
  if (M(/clean|maid|janitor|housekeep|pressure wash|window wash/)) return {
    category: 'cleaning', tagline: 'Come home to spotless.',
    about: 'Thorough, reliable cleaning from a team you can trust in your space. We sweat the corners so you never have to think about them.',
    servicesTitle: 'What we clean', ctaTitle: 'Ready for a cleaner place?', ctaText: 'Tell us the size of the job and we will quote it fast.',
    services: [['Deep Clean', 'Top to bottom, the one that resets the whole place.', '2728'], ['Recurring', 'Weekly or monthly visits that keep it effortless.', '1f4c5'], ['Move In / Out', 'Empty-home cleans that get the deposit back.', '1f4e6'], ['Windows', 'Streak-free glass, inside and out.', '1fa9f']] };
  if (M(/boat|marine|yacht|watercraft|pontoon|dealer.*boat|boat.*dealer|outboard/)) return {
    category: 'marine', tagline: 'Get out on the water.',
    about: 'New and used boats, straight talk, and a crew that actually boats. We will help you find the right one and keep it running for years.',
    servicesTitle: 'What we offer', ctaTitle: 'Ready to find your boat?', ctaText: 'Tell us how you like to spend time on the water and we will point you right.',
    services: [['Boat Sales', 'New and pre-owned boats matched to how you plan to use them.', '1f6a4'], ['Service & Repair', 'Factory-trained techs to keep you off the dock and on the water.', '1f527'], ['Parts & Rigging', 'The right gear, props and electronics, installed properly.', '2699'], ['Storage', 'Keep her covered and ready between trips.', '2693']] };
  if (M(/auto|mechanic|car repair|detailing|\btires?\b|body shop|collision|automotive|garage/)) return {
    category: 'auto', tagline: 'Honest work on your ride.',
    about: 'Straightforward diagnostics, fair prices and repairs that last. We tell you what you actually need — and what can wait.',
    servicesTitle: 'What we do', ctaTitle: 'Car acting up?', ctaText: 'Describe what is going on and we will get you scheduled.',
    services: [['Diagnostics', 'We find the real problem before touching a wrench.', '1f50d'], ['Repairs', 'From brakes to belts, done right the first time.', '1f527'], ['Maintenance', 'Oil, fluids and tune-ups to keep it healthy.', '1f6e2'], ['Detailing', 'Inside and out, looking like the day you got it.', '2728']] };
  if (M(/gym|fitness|trainer|crossfit|yoga|pilates|martial|boxing|cycle studio/)) return {
    category: 'fitness', tagline: 'Show up. Get stronger.',
    about: 'A room that pushes you without the ego. Coaches who know your name and a plan that actually fits your life.',
    servicesTitle: 'Train with us', ctaTitle: 'Ready to start?', ctaText: 'Come in for a first session and see if we are your place.',
    services: [['Personal Training', 'One-on-one coaching built around your goals.', '1f4aa'], ['Group Classes', 'High-energy sessions that are easy to stick with.', '1f3cb'], ['Open Gym', 'Your space, your pace, whenever it works.', '1f3cb'], ['Nutrition', 'Simple guidance that makes the training count.', '1f957']] };
  if (M(/\bpets?\b|dog|groom|\bvet|kennel|boarding|animal/)) return {
    category: 'pet', tagline: 'Love your pet as much as you do.',
    about: 'Gentle, attentive care from people who genuinely like animals. Your pet is in good hands — and you will see it when you pick them up.',
    servicesTitle: 'What we offer', ctaTitle: 'Give your pet the best.', ctaText: 'Tell us about your companion and we will set things up.',
    services: [['Grooming', 'Baths, cuts and nails that leave them fresh and happy.', '1f6c1'], ['Boarding', 'A safe, comfortable stay while you are away.', '1f3e1'], ['Daycare', 'Play, exercise and company all day long.', '1f415'], ['Wellness', 'Attentive care that keeps them feeling their best.', '1f43e']] };
  if (M(/photo|videograph|film|cinematograph/)) return {
    category: 'photo', tagline: 'Moments worth keeping.',
    about: 'Natural, unforced images that actually look like you. We make the session easy and the photos something you will treasure.',
    servicesTitle: 'What we shoot', ctaTitle: 'Let us capture it.', ctaText: 'Tell us about your shoot and we will check our dates.',
    services: [['Portraits', 'Relaxed sessions that bring out who you really are.', '1f4f7'], ['Events', 'Weddings and milestones, documented beautifully.', '1f389'], ['Branding', 'Images that make your business look the part.', '1f4bc'], ['Video', 'Short films that hold onto the feeling, not just the look.', '1f3a5']] };
  if (M(/boutique|apparel|clothing|jewelry|retail|store|shop|goods|merch|gift/)) return {
    category: 'retail', tagline: 'Finds you will actually love.',
    about: 'A carefully chosen selection, not a warehouse. Everything here earned its place — come see what we picked out for you.',
    servicesTitle: 'Why shop with us', ctaTitle: 'Come take a look.', ctaText: 'Browse in store or reach out and we will hold something for you.',
    services: [['Curated', 'A tight, thoughtful selection you can trust.', '1f6cd'], ['Local', 'Owned and run by people who live here too.', '1f4cd'], ['Personal', 'Real help from people who know the stock.', '1f91d'], ['Quality', 'Pieces chosen to last, not just to sell.', '2728']] };
  if (M(/handy|plumb|electric|hvac|heating|roofing|pest|pool|gutter|contractor|remodel|fence|deck|construction|painter|flooring/)) return {
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
const V3_FLAVORS = {
  barber: {
    tagline: ['A sharp cut, every time.', 'Look sharp. Feel sharper.', 'Clean fades, no fuss.', 'Where the regulars send their friends.', 'Your chair is waiting.', 'Fresh cut, fresh start.', 'Precision from the first snip.', 'The cut that makes the week.', 'Bad hair days end at this chair.', 'Walk in rough, walk out royalty.'],
    about: ['Walk in for a classic cut or a modern fade. We take our time, line things up right, and send you out looking your best.', 'No rushed cuts, no guesswork. We listen to what you want, sweat the details, and make sure you leave looking exactly how you pictured.', 'Old-school attention, modern styles. Pull up a chair, relax, and let us dial in a cut that holds up all week.'],
    ctaTitle: ['Ready for a fresh cut?', 'Need a line-up?', 'Time for a trim?', 'Grab a chair.', 'Looking sharp starts here.'],
    ctaText: ['Book a chair or walk in — we will take care of the rest.', 'Reserve a time or just stop by. The chair is warm.', 'Pick a time that works and leave the rest to us.'],
  },
  salon: {
    tagline: ['Hair you will want to show off.', 'Your best hair day, on repeat.', 'Cut, color, confidence.', 'Hair that fits your life.', 'Walk out feeling brand new.', 'Great hair starts with great listening.', 'Where your hair goals happen.', 'Come in flat, leave fabulous.', 'Your hair, main-character edition.'],
    about: ['From a trim to a full transformation, we listen first and cut to suit you — your hair, your face, your routine.', 'We treat your hair like it is ours: honest advice, careful work, and a look you can actually recreate at home.', 'Color, cuts and care that start with a real conversation. Tell us the goal and we will get you there, step by step.'],
    ctaTitle: ['Let us find your look.', 'Ready for a change?', 'Dreaming of new hair?', 'Let us talk hair.'],
    ctaText: ['Book a chair and tell us what you have in mind.', 'Reserve a time and bring your inspiration — we will make it real.', 'Tell us your goal and we will map out how to get there.'],
  },
  spa: {
    tagline: ['An hour that is just for you.', 'Exhale. You are here now.', 'Rest, restore, repeat.', 'Your calm, on the calendar.', 'Self-care, done right.', 'Leave lighter than you came.', 'A little quiet goes a long way.', 'Stress called. We did not pick up.', 'The reset button you can book.'],
    about: ['Step away from the noise. Our treatments are about taking care of yourself, done properly, in a space made to relax in.', 'A calm room, skilled hands, and time that is entirely yours. Come as you are and leave a little lighter.', 'We built this place to be the pause in your week — thoughtful treatments, no rush, all about how you feel when you leave.'],
    ctaTitle: ['Treat yourself.', 'Ready to unwind?', 'You have earned this.', 'Book your reset.'],
    ctaText: ['Book a time that works and leave the rest to us.', 'Reserve your spot and let the day melt away.', 'Pick a time — we will have everything ready.'],
  },
  tattoo: {
    tagline: ['Art that stays with you.', 'Your story, in ink.', 'Clean lines, real art.', 'Made to last, made for you.', 'Ink you will be proud of.', 'From idea to forever.', 'Custom work, done right.', 'Commitment, but make it art.', 'No regerts — we double-check the spelling.'],
    about: ['Custom work, clean lines and a studio that takes aftercare seriously. Bring an idea or a reference and we will make it yours.', 'We design around you — your idea, your placement, your style. Sterile, careful, and never off a flash sheet unless you want it.', 'Good tattoos start with a real conversation. Share the concept and we will sketch something you will want to wear for life.'],
    ctaTitle: ['Have an idea?', 'Ready to get inked?', 'Got a concept?', 'Let us make it real.'],
    ctaText: ['Send us your concept and we will set up a consult.', 'Share your idea and we will sketch a plan.', 'Tell us the vision — size, placement, style — and we will take it from there.'],
  },
  bakery: {
    tagline: ['Baked fresh every morning.', 'Still warm from the oven.', 'Made by hand, early.', 'Real butter, real time.', 'The good stuff, baked daily.', 'Small batches, big flavor.', 'Mornings are better here.', 'Carbs are a love language.', 'We rise early so you do not have to.'],
    about: ['Everything is made by hand, early, in small batches. Real butter, real time, and nothing sitting around until tomorrow.', 'We are up before the sun so you do not have to be. Everything is scratch-made, small-batch, and best the day it is baked.', 'No shortcuts, no day-olds pretending to be fresh. Just honest baking, done every morning, the way it should be.'],
    ctaTitle: ['Come by while it is warm.', 'Fresh out of the oven.', 'Get it while it lasts.', 'Treat yourself this morning.'],
    ctaText: ['Stop in this morning or order ahead for pickup.', 'Swing by early or reserve your favorites.', 'Order ahead for pickup — the good stuff goes fast.'],
  },
  cafe: {
    tagline: ['Your new regular spot.', 'Good coffee, better company.', 'Where your morning slows down.', 'Pull up and stay a while.', 'The cup that starts the day.', 'Coffee worth the trip.', 'Your corner for a good cup.', 'The third place between home and work.', 'Powered by caffeine and good company.'],
    about: ['Good coffee, a calm room and a welcome that makes you want to stay. Whether it is a quick cup or a slow afternoon, you are in the right place.', 'We care about the cup and the room it is served in. Come for the coffee, stay because it feels like yours.', 'A proper espresso, a comfortable seat, and no one rushing you out the door. That is the whole idea.'],
    ctaTitle: ['See you in the morning.', 'Coffee is on.', 'First cup is calling.', 'Swing by.'],
    ctaText: ['Swing by or order ahead and skip the line.', 'Grab a seat or order to go — either way, see you soon.', 'Order ahead and your cup is ready when you are.'],
  },
  restaurant: {
    tagline: ['Food worth coming back for.', 'Cooked like it matters.', 'Your table is ready.', 'Honest food, made to order.', 'Flavor you can taste the care in.', 'Come hungry, leave happy.', 'The kind of meal you tell people about.', 'Good food, good people, good night.', 'Eat like you mean it.', 'Reservations optional, cravings mandatory.'],
    about: ['Honest cooking made from good ingredients, served by people who are glad you came in. Pull up a seat — we saved you one.', 'We cook the way we would for family: fresh, from scratch, and with the kind of care you can taste. Come see for yourself.', 'Real ingredients, real cooking, and a room that feels like a welcome. No fuss — just food you will want again.'],
    ctaTitle: ['Hungry yet?', 'Pull up a chair.', 'Let us eat.', 'Come sit with us.', 'Save me a seat.'],
    ctaText: ['Reserve a table or order ahead for pickup.', 'Book a table or swing by — we will take it from there.', 'Call ahead, order online, or just walk in. We are glad you are here.'],
  },
  lawn: {
    tagline: ['A yard you will be proud of.', 'Green, tidy, done.', 'We mow, you relax.', 'Curb appeal, handled.', 'Your weekend back, your lawn handled.', 'The best-looking yard on the block.', 'Lawn care without the hassle.', 'The grass really is greener here.', 'We bring the mower, you bring the lemonade.'],
    ctaTitle: ['Want a tidier yard?', 'Ready for a greener lawn?', 'Tired of mowing?', 'Let us handle the yard.'],
    ctaText: ['Tell us your address and we will put together a fair price.', 'Send your details and we will quote it fast.', 'Get a quick quote and reclaim your weekends.'],
  },
  cleaning: {
    tagline: ['A cleaner space, less stress.', 'Come home to clean.', 'Spotless, every time.', 'The clean you do not have time for.', 'We sweat the details.', 'Clean you can feel.', 'Your place, at its best.', 'Dust does not stand a chance.', 'We make clean look easy. It is not.'],
    ctaTitle: ['Want it spotless?', 'Ready for a cleaner space?', 'Let us handle the mess.', 'Reclaim your time.'],
    ctaText: ['Tell us about your space for a fast, fair quote.', 'Send the details and we will quote it quick.', 'Get a quote and cross cleaning off your list.'],
  },
  marine: {
    tagline: ['Your day on the water starts here.', 'Built for the water, backed by us.', 'More time on the water.', 'From our dock to yours.', 'The boat you have been waiting for.', 'Sales and service you can trust.', 'Less dock time, more water time.', 'The boat you have been picturing.'],
    ctaTitle: ['Ready to get on the water?', 'Looking for your next boat?', 'Let us find your fit.'],
    ctaText: ['Tell us how you will use it and we will point you to the right boat.', 'Reach out and we will match you to the right rig.', 'Stop by or message us — we will help you find the one.'],
  },
  auto: {
    tagline: ['Honest work, fair prices.', 'Back on the road, done right.', 'Repairs you can trust.', 'We fix it right the first time.', 'Straight talk, solid work.', 'Your car is in good hands.', 'We speak fluent check-engine light.', 'That weird noise? We have heard it before.'],
    ctaTitle: ['Car acting up?', 'Need a look under the hood?', 'Time for service?', 'Let us get you rolling.'],
    ctaText: ['Tell us what is going on and we will get you a straight quote.', 'Describe the issue and we will take it from there.', 'Book a time and we will have you back on the road.'],
  },
  fitness: {
    tagline: ['Stronger starts here.', 'Show up — we will handle the rest.', 'Your goals, our game plan.', 'Progress you can feel.', 'Train with people who get it.', 'The work pays off here.', 'Sweat now, shine later.', 'Showing up is the hard part — we handle the rest.'],
    ctaTitle: ['Ready to start?', 'Let us get to work.', 'Time to level up?', 'Your first session awaits.'],
    ctaText: ['Reach out and we will build a plan around your goals.', 'Tell us where you are at and we will map the path.', 'Book a session and let us get moving.'],
  },
  pet: {
    tagline: ['Care your pet will love.', 'Where tails wag.', 'Treated like family.', 'Happy pets, happy you.', 'Gentle hands, happy pets.', 'The care they deserve.', 'Belly rubs included, always.', 'Your best friend, in the best hands.'],
    ctaTitle: ['Give your pet the best.', 'Ready to book?', 'Spoil your best friend.'],
    ctaText: ['Tell us about your companion and we will set things up.', 'Reach out and we will find the right time.', 'Book a visit — we cannot wait to meet them.'],
  },
  photo: {
    tagline: ['Moments worth keeping.', 'Your story, beautifully told.', 'Real moments, real photos.', 'Memories made to last.', 'Pictures that feel like you.', 'The day, remembered right.', 'Say cheese, mean it.', 'Memories you will not have to describe.'],
    ctaTitle: ['Let us capture it.', 'Ready for your shoot?', 'Let us make something.', 'Got a date in mind?'],
    ctaText: ['Tell us about your shoot and we will check our dates.', 'Share your vision and we will plan the session.', 'Reach out and let us find your date.'],
  },
  retail: {
    tagline: ['Finds you will actually love.', 'Curated, not crowded.', 'Treasures worth the trip.', 'Something special, always.', 'Picked with you in mind.', 'The good stuff, in one place.', 'Window shopping, dangerously good.', 'You did not know you needed it. Now you do.'],
    about: ['A carefully chosen selection, not a warehouse. Everything here earned its place — come see what we picked out for you.', 'We shop so you do not have to sift. Every piece is chosen by hand, with you and this town in mind.', 'Small, thoughtful and always a little surprising. Stop in and find something you did not know you needed.'],
    ctaTitle: ['Come take a look.', 'Ready to browse?', 'Find your next favorite.', 'Stop in and see.'],
    ctaText: ['Browse in store or reach out and we will hold something for you.', 'Come see what is new, or message us to set something aside.', 'Shop with us — we will help you find it.'],
  },
  home: {
    tagline: ['Done right, done once.', 'Built to last, done to impress.', 'Your project, in good hands.', 'Quality work, no surprises.', 'We treat your home like ours.', 'Craft you can count on.', 'Measure twice, impress once.', 'The contractor who actually calls back.'],
    about: ['Licensed, tidy and on time. We treat your home with respect and leave it better than we found it — no surprises on the bill.', 'Straight quotes, clean work, and a crew that shows up when it says it will. We build it like it is our own place.', 'No cut corners, no vanishing acts. Just honest craftsmanship, clear communication, and work that holds up for years.'],
    ctaTitle: ['Got a project?', 'Ready to get started?', 'Need an estimate?', 'Let us build it.'],
    ctaText: ['Describe the job and we will get you a straight quote.', 'Tell us what you are planning and we will quote it honestly.', 'Send the details and we will map out the work.'],
  },
  generic: {
    tagline: ['Proud to serve our community.', 'Local, dependable, here for you.', 'Your neighbors, at your service.', 'Doing right by our community.', 'Here when you need us.', 'Service you can count on.', 'The local name people actually recommend.', 'Big-city service, hometown heart.'],
    ctaTitle: ['Let us get started.', 'Ready when you are.', 'How can we help?', 'Reach out anytime.'],
    ctaText: ['Reach out and we will take it from here.', 'Get in touch and we will help you out.', 'Send us a note — we would love to help.'],
  },
};
function v3FlavorPick(arr) { return (arr && arr.length) ? arr[Math.floor(Math.random() * arr.length)] : ''; }

// Structural copy pools used across every generated site (steps, page CTAs, pageheads, forms).
// These are the lines that used to be identical on every site — now each one is picked fresh.
const V3_COPY = {
  featured: ['Featured', 'A few favorites', 'Fan favorites', 'Popular picks', 'Pick of the bunch', 'Start here', 'Worth a look', 'The highlights'],
  whatWeDo: ['What we do', 'What we offer', 'How we help', 'The short list', 'What we are good at', 'Where we shine', 'How we can help'],
  stepsTitle: ['How it works', 'Getting started is easy', 'Three simple steps', 'How we work', 'From hello to done', 'Easy as one, two, three'],
  stepsSets: [
    [['Reach out', 'Tell us what you need and when works for you.'], ['We plan it', 'We confirm the details and give you a clear, honest price.'], ['We deliver', 'We do the work and make sure you are happy with it.']],
    [['Tell us the goal', 'Share what you are after — no detail is too small.'], ['Get a clear plan', 'We map it out and quote it straight, no surprises.'], ['Sit back', 'We handle the work and keep you posted the whole way.']],
    [['Say hello', 'Send a message or give us a call to get the ball rolling.'], ['We figure it out together', 'We listen, ask good questions, and make a plan that fits.'], ['We make it happen', 'You get it done right — and done when we said.']],
    [['Book a time', 'Pick a slot that works for you, online or by phone.'], ['We show up ready', 'On time, prepared, and respectful of your space.'], ['You are all set', 'Great work, no loose ends, and a smile on the way out.']],
  ],
  shopCta: { title: ['Ready to order?', 'See something you like?', 'Treat yourself.', 'Fill that cart.', 'Go on, you deserve it.'], text: ['Add your favorites to the cart and check out in seconds.', 'Fill your cart and check out — quick and painless.', 'Found something? Checkout takes about ten seconds.'] },
  serviceCta: { title: ['Ready to get started?', 'Let us take it from here.', 'Got a project in mind?', 'Let us make it easy.', 'Say the word.'], text: ['Book a time or send us a message — we will take it from there.', 'Tell us what you need and we will handle the rest.', 'Reach out and we will get the ball rolling today.'] },
  aboutCta: { title: ['Let us work together.', 'Nice to meet you.', 'Let us make something good.', 'Come say hi.', 'This is the start of something.'], text: ['Have a question or ready to start? We are one message away.', 'Like what you see? Let us talk about what you need.', 'We would love to help — reach out any time.'] },
  contactHead: { title: ['Visit & contact', 'Get in touch', 'Say hello', 'Let us talk', 'Come find us', 'Reach out'], textCity: ['Find us in CITY.', 'We are right here in CITY — come by.', 'Based in CITY and glad to help.', 'Proudly serving CITY and nearby.'], textNoCity: ['We would love to hear from you.', 'Questions, bookings, or just saying hi — we are here.', 'Drop us a line and we will get right back to you.'] },
  formTitle: ['Get in touch', 'Send us a message', 'Drop us a line', 'Say hello', 'Let us help'],
  formText: ['Send us a message and we will get right back to you.', 'Tell us what you need — we usually reply within a day.', 'Questions or ready to book? Fill this out and we will be in touch.', 'Leave your details and we will reach out fast.'],
  formSuccess: ['Thanks! Your message is on its way — we will be in touch soon.', 'Got it — thanks for reaching out. We will reply shortly.', 'Message sent! We will get back to you as soon as we can.', 'Thanks for reaching out — talk soon.'],
  shopHead: ['Browse the collection and order online.', 'Everything we make, in one place.', 'Have a look around — order whenever you are ready.', 'The full lineup, ready when you are.'],
  menuHead: ['Everything we make, fresh to order.', 'The full menu, made the way you like it.', 'Dig in — it is all made fresh.', 'Everything good, in one place.'],
  servicesHead: ['Everything we offer, at a glance.', 'What we can do for you.', 'The full list of what we handle.', 'Here is how we can help.'],
};
const V3_STEPS_BY_KIND = {
  // people come to you (chair, table, studio, gym)
  visit: [
    [['Book a time', 'Pick a slot online or give us a call, whatever is easier.'], ['Come on in', 'Grab a seat. We talk it through before we start.'], ['Leave happy', 'You walk out looking and feeling the way you wanted.']],
    [['Reserve your spot', 'Choose a day and time that fits your week.'], ['We get to know you', 'Tell us what you like. We listen first.'], ['Enjoy the result', 'Relax and let us take care of the details.']],
    [['Say hi', 'Book online, call, or just stop by.'], ['Settle in', 'We make you comfortable and get to work.'], ['See you next time', 'Most of our clients become regulars.']],
  ],
  // you go to them (lawn, cleaning, trades)
  onsite: [
    [['Book a time', 'Pick a slot that works for you, online or by phone.'], ['We show up ready', 'On time, prepared, and respectful of your space.'], ['You are all set', 'Great work, no loose ends, and a smile on the way out.']],
    [['Get a free quote', 'Tell us about the job and we reply fast with a clear price.'], ['Pick a date', 'We work around your schedule, not the other way around.'], ['Done right', 'We do the work, clean up, and make sure you are happy.']],
    [['Tell us what you need', 'A quick message or call is all it takes.'], ['We plan it out', 'A straight answer on price and timing, no surprises.'], ['We get it done', 'Quality work, finished when we said it would be.']],
  ],
  // projects and professional services
  project: V3_COPY.stepsSets.slice(0, 3),
};
function v3StepsKind(cat) {
  if (['barber', 'salon', 'spa', 'tattoo', 'fitness', 'pet', 'dental', 'health', 'education'].indexOf(cat) > -1) return 'visit';
  if (['lawn', 'cleaning', 'home', 'moving'].indexOf(cat) > -1) return 'onsite';
  return 'project';
}
function v3StepsItems(cat) { const sets = V3_STEPS_BY_KIND[v3StepsKind(cat || '')] || V3_COPY.stepsSets; const set = v3FlavorPick(sets) || sets[0]; return set.map((x) => ({ name: x[0], text: x[1] })); }
function v3Pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function v3Starter(type) {
  const r = v3StarterBase(type);
  // Freshen the copy: pick a random tagline / CTA (and about, where we have variations) per site.
  const F = V3_FLAVORS[r.category];
  if (F) {
    if (F.tagline) r.tagline = v3FlavorPick(F.tagline) || r.tagline;
    if (F.about) r.about = v3FlavorPick(F.about) || r.about;
    if (F.ctaTitle) r.ctaTitle = v3FlavorPick(F.ctaTitle) || r.ctaTitle;
    if (F.ctaText) r.ctaText = v3FlavorPick(F.ctaText) || r.ctaText;
  }
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
  };
  // Type theme per category: 'bold' (condensed Monochrome look), 'editorial' (serif), 'clean' (Plex).
  const TYPE_BY_CAT = {
    barber: 'bold', tattoo: 'bold', auto: 'bold', fitness: 'bold', marine: 'bold', home: 'bold',
    salon: 'editorial', spa: 'editorial', bakery: 'editorial', cafe: 'editorial', restaurant: 'editorial', photo: 'editorial', retail: 'editorial',
    lawn: 'clean', cleaning: 'clean', pet: 'clean', generic: 'clean',
    legal: 'editorial', dental: 'clean', health: 'clean', finance: 'clean', realestate: 'editorial', education: 'clean', events: 'editorial', moving: 'bold', studio: 'bold',
  };
  // A second type style that also suits each category, used some of the time for variety.
  const TYPE_ALT = { bold: 'clean', editorial: 'clean', clean: 'editorial' };
  const FAQ = {
    barber: [['Do I need an appointment?', 'Walk-ins are always welcome, and you can book ahead if you would rather lock in a time.'], ['How long does a cut take?', 'Most cuts run about 30 to 45 minutes, a little longer with a beard or a shave.'], ['Not sure what to ask for?', 'Tell us the look you are going for and we will guide you to the right cut.']],
    salon: [['How do I book?', 'Reach out by phone or message and we will find a time that works for you.'], ['Can you match a photo I bring in?', 'Absolutely. Bring a reference and we will tell you honestly what will work with your hair.'], ['Do you do color corrections?', 'Yes. Book a consultation first so we can plan the safest path to your goal.']],
    spa: [['Should I arrive early?', 'Arrive a few minutes ahead so you can settle in and start relaxed.'], ['What if I need to reschedule?', 'Just give us a heads up and we will happily move your appointment.'], ['Are treatments customizable?', 'Every treatment is tailored to you — tell us your preferences when you arrive.']],
    tattoo: [['How do I get a quote?', 'Send us your idea, size and placement and we will give you an honest estimate.'], ['Do you take walk-ins?', 'Some days, yes — but booking ahead guarantees your spot and your artist.'], ['How should I prepare?', 'Eat beforehand, stay hydrated, and wear something that gives us easy access to the area.']],
    bakery: [['Do you take custom orders?', 'Yes — reach out a few days ahead for cakes and large orders.'], ['When are you freshest?', 'Everything comes out through the morning, so earlier is better for the full case.'], ['Do you have options for dietary needs?', 'Ask us about the day\'s options — we usually have something for most needs.']],
    cafe: [['Do you have non-dairy milk?', 'Yes, just let us know your preference when you order.'], ['Can I work here for a while?', 'Of course — grab a seat, we are happy to have you stay.'], ['Do you take orders ahead?', 'Reach out and we will let you know the easiest way to order ahead.']],
    restaurant: [['Do you take reservations?', 'Yes — reach out to book a table, especially for larger groups.'], ['Do you offer takeout?', 'We do. Call ahead and we will have it ready.'], ['Can you handle dietary restrictions?', 'Let us know when you order and the kitchen will do its best to accommodate.']],
    lawn: [['How do I get a quote?', 'Tell us your address and what you need, and we will put together a fair price.'], ['Do you offer regular service?', 'Yes — weekly or biweekly schedules are our most popular option.'], ['What areas do you cover?', 'Reach out with your location and we will confirm we serve your area.']],
    cleaning: [['How do you price a clean?', 'Pricing depends on size and scope — tell us about your space for a fast quote.'], ['Do I need to be home?', 'That is up to you. Many clients give us access and go about their day.'], ['Do you bring supplies?', 'Yes, we arrive with everything needed unless you prefer we use yours.']],
    marine: [['Do you take trade-ins?', 'Yes — tell us about your current boat and we will work out a fair value.'], ['Do you service what you sell?', 'We do. Our shop keeps you running long after the sale.'], ['Can you help me choose?', 'Tell us how you plan to use it and we will point you to the right fit.']],
    auto: [['Do I need an appointment?', 'Appointments keep things quick, but reach out and we will fit you in.'], ['Will you tell me before any work?', 'Always. You approve the price before we touch anything.'], ['Do you offer a warranty?', 'Yes — ask us about the warranty on parts and labor for your repair.']],
    fitness: [['Can I try before I join?', 'Yes — come in for a first session and see if we are the right fit.'], ['Do I need to be in shape already?', 'Not at all. We meet you where you are and build from there.'], ['What should I bring?', 'Just comfortable clothes, shoes and water — we have the rest.']],
    pet: [['How do I book?', 'Reach out with your pet\'s details and we will set up a time.'], ['Is my pet safe with you?', 'Always. Your pet is supervised and cared for like our own.'], ['What do I need to bring?', 'Food, any medications, and anything that keeps them comfortable.']],
    photo: [['How do we book a session?', 'Reach out with your dates and what you have in mind and we will check availability.'], ['When do we get our photos?', 'We will give you a clear timeline when we book — quality takes a little time.'], ['What should we wear?', 'We are happy to help you plan outfits so everything looks cohesive.']],
    retail: [['Can you hold an item for me?', 'Reach out and we will set it aside while you decide.'], ['Do you restock sold-out items?', 'Sometimes — message us and we will let you know.'], ['Do you ship?', 'Ask us about shipping options for the pieces you love.']],
    legal: [['Is the first consultation free?', 'Reach out and we will tell you exactly how the first meeting works and what it costs, before you commit to anything.'], ['What should I bring?', 'Any documents, letters or dates related to your situation. If you are not sure, bring it.'], ['How quickly will I hear back?', 'We aim to reply within one business day.']],
    dental: [['Are you taking new patients?', 'Yes. Request an appointment and we will get you scheduled.'], ['I am nervous about the dentist. Can you help?', 'Absolutely. Tell us, and we will go at your pace and explain everything first.'], ['Do you take insurance?', 'Reach out with your plan and we will check your coverage for you.']],
    health: [['Do I need a referral?', 'Usually not. Get in touch and we will let you know for your situation.'], ['What should I bring to my first visit?', 'Any relevant records, a list of medications, and your questions.'], ['How soon can I be seen?', 'Request an appointment and we will offer the earliest time that works.']],
    finance: [['How much does it cost?', 'It depends on what you need. We give you a clear quote up front, with no surprises.'], ['Can you work with my existing records?', 'Yes. We will tidy things up and get you on track.'], ['Do you work with small businesses?', 'Absolutely. Most of our clients are individuals and small businesses.']],
    realestate: [['How much is my home worth?', 'Request a free valuation and we will give you an honest, local estimate.'], ['How long does it take to sell?', 'It depends on price and season. We will give you a realistic timeline up front.'], ['Do you help first-time buyers?', 'Yes, and we will walk you through every step.']],
    education: [['What ages do you teach?', 'Reach out with a little about the student and we will let you know if we are the right fit.'], ['Can we do a trial lesson?', 'Yes. A first session is the best way to see how we work together.'], ['Do you offer online lessons?', 'We do, with the same care and structure as in person.']],
    events: [['How far ahead should we book?', 'As early as you can, especially for popular dates. Reach out and we will check availability.'], ['Can you work with our budget?', 'Yes. Tell us what you have in mind and we will make the most of it.'], ['Do you travel?', 'Often. Let us know where your event is.']],
    moving: [['How do you price a move?', 'Based on size, distance and timing. Tell us the details for a free quote.'], ['Are my things insured?', 'Ask us about coverage when you book. We will explain your options.'], ['Do you supply boxes?', 'We can, along with all the packing materials you need.']],
    studio: [['How does a project start?', 'With a short call to understand your goals. Then we send a clear proposal.'], ['How long does it take?', 'It depends on scope. You will get a realistic timeline before we begin.'], ['Do you work with small businesses?', 'Yes. Many of our favorite clients are small, local teams.']],
    generic: [['How do I get started?', 'Send us a message or give us a call and we will take it from there.'], ['How much does it cost?', 'Every job is a little different. Reach out and we will give you a clear answer.'], ['How quickly do you reply?', 'We usually get back to you within one business day.']],
    home: [['How do I get an estimate?', 'Tell us about the project and we will give you a clear, no-pressure quote.'], ['Are you licensed and insured?', 'Yes — we are happy to share details before any work begins.'], ['How soon can you start?', 'Reach out with your timeline and we will tell you our soonest availability.']],
  };
  const _tb = TYPE_BY_CAT[r.category] || 'bold';
  r.typeset = Math.random() < 0.7 ? _tb : TYPE_ALT[_tb];
  r.palette = v3FlavorPick(PAL_SETS[r.category] || ['w_mono', 'w_slate', 'w_charcoal']);
  // Now and then use the dark (Noir) twin of the chosen light theme, when it exists.
  try { if (Math.random() < 0.2) { const _dk = 'b_' + r.palette.slice(2); if (WSENGINE.palettes.some((p) => p.id === _dk)) r.palette = _dk; } } catch (e) {}
  r.faq = FAQ[r.category] || FAQ.generic || [];
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
  retail: 'boutique shop interior', home: 'home renovation craftsmanship', generic: 'local small business storefront'
};
async function unsplashPhotos(query, env, n) {
  try {
    if (!env || !env.UNSPLASH_ACCESS_KEY || !query) return [];
    const url = 'https://api.unsplash.com/search/photos?per_page=24&orientation=landscape&content_filter=high&query=' + encodeURIComponent(query);
    const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    const to = ctrl ? setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, 4500) : 0;
    let r;
    try { r = await fetch(url, { headers: { 'Authorization': 'Client-ID ' + env.UNSPLASH_ACCESS_KEY, 'Accept-Version': 'v1' }, signal: ctrl ? ctrl.signal : undefined }); }
    finally { if (to) clearTimeout(to); }
    if (!r || !r.ok) return [];
    const j = await r.json();
    const results = (j && j.results) || [];
    const out = [];
    for (let i = 0; i < results.length && out.length < (n || 4); i++) {
      const raw = results[i] && results[i].urls && (results[i].urls.regular || results[i].urls.full || results[i].urls.raw);
      if (raw) {
        const u = results[i].user || {};
        out.push({ url: raw + (raw.indexOf('?') > -1 ? '&' : '?') + 'w=1680&q=75&auto=format&fit=crop', name: u.name || 'Unsplash', link: (u.links && u.links.html) || 'https://unsplash.com', download: (results[i].links && results[i].links.download_location) || '' });
      }
    }
    return out;
  } catch (e) { return []; }
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
    const ck = 'place:' + id;
    if (env.KV) { const c = await env.KV.get(ck); if (c) return new Response(c, { headers: cors }); }
    const r = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(id), { headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews' } });
    if (!r.ok) return new Response(JSON.stringify({ error: 'google error' }), { status: 502, headers: cors });
    const p = await r.json();
    const out = JSON.stringify({
      name: (p.displayName && p.displayName.text) || '', rating: typeof p.rating === 'number' ? p.rating : null, reviews: typeof p.userRatingCount === 'number' ? p.userRatingCount : null, url: p.googleMapsUri || '',
      items: (p.reviews || []).slice(0, 5).map(function (v) { return { rating: v.rating || 0, text: String((v.text && v.text.text) || (v.originalText && v.originalText.text) || '').slice(0, 600), name: (v.authorAttribution && v.authorAttribution.displayName) || 'Google user', when: v.relativePublishTimeDescription || '' }; }).filter(function (v) { return v.text; }),
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
    if (env.KV) { const ip = request.headers.get('cf-connecting-ip') || '0'; const k = 'pfrate:' + ip; const n = parseInt((await env.KV.get(k)) || '0', 10) || 0; if (n >= 30) return jsonR({ ok: false, error: 'Too many lookups. Try again later.', results: [] }, 429); await env.KV.put(k, String(n + 1), { expirationTtl: 3600 }); }
    const r = await fetch('https://places.googleapis.com/v1/places:searchText', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount' }, body: JSON.stringify({ textQuery: q, pageSize: 5 }) });
    const j = await r.json();
    return jsonR({ ok: true, results: ((j && j.places) || []).map(function (p) { return { id: p.id, name: (p.displayName && p.displayName.text) || '', address: p.formattedAddress || '', rating: p.rating || null, count: p.userRatingCount || 0 }; }) });
  } catch (e) { return jsonR({ ok: false, error: 'Lookup failed.', results: [] }); }
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

// Split a finished flat section stack into a real multi-page site (Home + Shop/Menu/Services, About, Contact)
// with cross-page nav. Each section object is MOVED to exactly one page (photos/ids preserved); home gets a
// lightweight "featured" teaser and sub-pages get their own header + call-to-action. Keeps site.sections as a
// single-page fallback so legacy/one-page consumers still work.
function v3Pages(site, sc, isShop) {
  try {
    const all = (site.sections || []).slice();
    const first = (t) => all.find((s) => s.type === t);
    const many = (t) => all.filter((s) => s.type === t);
    const uid = () => WSENGINE.uid();
    const mk = (type, ov) => Object.assign({ id: type + '-' + uid(), type: type }, WSENGINE.sections[type].create(site), ov || {});
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
    const isFood = /restaurant|cafe|bakery|food|coffee|truck|donut|kitchen|deli|pizza|bar\b/i.test(cat + ' ' + (b.type || ''));
    const mainLabel = isShop ? 'Shop' : (isFood ? 'Menu' : 'Services');
    const mainPath = isShop ? 'shop' : (isFood ? 'menu' : 'services');
    // A real "do something" page by type: reservation (food), quote (project trades), appointment (personal
    // services). Shops already have the cart as their action, so they get none.
    const quoteCats = ['lawn', 'cleaning', 'home', 'marine', 'auto', 'moving', 'events', 'studio', 'finance'];
    let bk = null;
    if (isShop) bk = null;
    else if (isFood) bk = { mode: 'reservation', path: 'reserve', title: 'Reserve', short: 'Reserve', head: 'Reserve a table', btn: 'Reserve a table', sub: 'Tell us when you are coming and we will confirm your table.', ok: 'Reservation request sent! We will confirm shortly.' };
    else if (quoteCats.indexOf(cat) >= 0) bk = { mode: 'quote', path: 'quote', title: 'Get a Quote', short: 'Quote', head: 'Get a free quote', btn: 'Request a quote', sub: 'Tell us about the job and we will send over a fair price.', ok: 'Thanks! We will review it and get you a quote soon.' };
    else bk = { mode: 'appointment', path: 'book', title: 'Book', short: 'Book', head: 'Book an appointment', btn: 'Request appointment', sub: 'Pick a time that works and we will confirm by text or email.', ok: 'Request received! We will confirm your appointment shortly.' };

    const pages = [];

    // ----- HOME: one of several complete layouts. Variants are picked from what the site really has
    // (photo layouts only when there is a photo), so every combination renders finished, never empty. -----
    const photos = site.photos || {};
    const hasPhoto = (sec) => !!(sec && photos[sec.id + '.photo']);
    const home = [];
    announce.forEach((s) => home.push(s));
    if (hero) {
      const _formal = ['legal', 'dental', 'health', 'finance', 'realestate', 'studio', 'generic'].indexOf(cat) > -1;
      hero.variant = hasPhoto(hero) ? v3Pick(['photo', 'photo', 'split']) : (_formal ? 'photo' : v3Pick(['photo', 'photo', 'type']));
      if (hero.variant === 'type' && !hero.emoji) { try { hero.emoji = (WSENGINE.emojiRecsFor(b.type) || [])[0] || ''; } catch (e) {} }
      home.push(hero);
    }
    const mainSrc = products || services;
    const teaserItems = mainSrc ? (mainSrc.items || []).slice(0, 3).map((it) => ({ emoji: it.emoji || '', name: it.name || it.title || '', text: it.text || it.desc || '', from: it.price || it.from || '' })) : [];
    const teaser = teaserItems.length ? mk('services', { variant: v3Pick(['grid', 'grid', 'list']), title: v3FlavorPick(products ? V3_COPY.featured : V3_COPY.whatWeDo), items: teaserItems }) : null;
    // A short story band for home, using a different line than the About page will (no repeated paragraph).
    let homeUsedIntro = false;
    let homeIntro = null;
    const V3_PROMISE = {
      visit: ['Every visit starts with a real conversation about what you want.', 'Come as you are. We take our time and do it properly.', 'Friendly people, good work, and a space you will look forward to coming back to.'],
      onsite: ['We show up when we say, do the job right, and leave the place better than we found it.', 'Honest prices, careful work and clear communication from start to finish.', 'Local, reliable and proud of every job we finish.'],
      project: ['Straight answers, fair prices and work we are proud to put our name on.', 'We listen first, keep you in the loop, and deliver what we promised.', 'Small enough to care, experienced enough to get it right.'],
    };
    const aboutPool = (((V3_FLAVORS[cat] && V3_FLAVORS[cat].about) || []).concat(isShop || isFood ? [] : V3_PROMISE[v3StepsKind(cat)])).filter((t) => t && t !== (intro && intro.text));
    if (!teaser && intro) { homeIntro = intro; homeUsedIntro = true; }
    else if (aboutPool.length) homeIntro = mk('intro', { variant: 'center', text: v3Pick(aboutPool), emoji: '' });
    const steps = (!isShop && !isFood && (services || prices)) ? mk('steps', { title: v3FlavorPick(V3_COPY.stepsTitle), items: v3StepsItems(cat) }) : null;
    const gal = gallery[0] || null;
    const faqTop = faq && (faq.items || []).length >= 2 ? mk('faq', { variant: 'accordion', title: v3Pick(['Quick answers', 'Good to know', 'Common questions']), items: (faq.items || []).slice(0, 3) }) : null;
    const hasReach = !!(b.address || (b.hours || []).some((h) => h && h.open) || b.phone);
    const visitHome = (hasReach && visit) ? mk('visit', { variant: b.address ? v3Pick(['hours', 'map']) : 'hours', title: '' }) : null;
    const recipes = [
      [teaser, homeIntro, steps, reviews, gal, cta],
      [homeIntro, teaser, gal, steps, reviews, faqTop, cta],
      [teaser, gal, homeIntro, reviews, visitHome, cta],
      [teaser, steps, homeIntro, reviews, faqTop, cta],
    ];
    if (isFood) recipes.push([homeIntro, teaser, gal, reviews, visitHome, cta], [teaser, homeIntro, gal, visitHome, cta]);
    const seen = new Set();
    v3Pick(recipes).filter(Boolean).forEach((s) => { if (!seen.has(s)) { seen.add(s); home.push(s); } });
    // Gallery went to the home page; keep it off the About page so section ids stay unique.
    if (gal && home.indexOf(gal) > -1) gallery.splice(gallery.indexOf(gal), 1);
    const hasMain = !!(products || services || prices);
    // Home CTA drives to the booking/reserve/quote page when there is one, else the main page or contact.
    if (cta) {
      cta.link = bk ? ('#/' + bk.path) : (hasMain ? ('#/' + mainPath) : '#/contact');
      cta.button = bk ? bk.btn : (isShop ? 'Shop now' : 'Get in touch');
      if (cta.variant === 'split' && !hasPhoto(cta)) cta.variant = 'band';
    }
    pages.push({ id: 'pg-home', path: '', title: 'Home', nav: true, sections: home });

    // ----- MAIN: Shop / Menu / Services (full catalog + its own CTA) -----
    const mainSection = products || services || prices;
    if (mainSection) {
      const mainSecs = [];
      mainSecs.push(mk('pagehead', { title: mainLabel, text: v3FlavorPick(isShop ? V3_COPY.shopHead : (isFood ? V3_COPY.menuHead : V3_COPY.servicesHead)), emoji: '' }));
      if (mainSection.type === 'services') mainSection.variant = v3Pick(['grid', 'list']);
      mainSecs.push(mainSection);
      if (prices && prices !== mainSection) mainSecs.push(prices);
      const mcta = isShop ? V3_COPY.shopCta : V3_COPY.serviceCta;
      mainSecs.push(mk('cta', { variant: 'band', title: v3FlavorPick(mcta.title), text: v3FlavorPick(mcta.text), button: b.bookLabel || 'Get in touch', link: bk ? ('#/' + bk.path) : '#/contact', emoji: '' }));
      pages.push({ id: 'pg-main', path: mainPath, title: mainLabel, nav: true, sections: mainSecs });
    }

    // ----- BOOK / RESERVE / QUOTE: a real request form (→ owner's inbox), by business type -----
    if (bk) {
      const svcNames = (((services && services.items) || (prices && prices.items) || [])).map((it) => ({ name: it.name || it.title || '' })).filter((x) => x.name);
      const bsecs = [
        mk('pagehead', { title: bk.head, text: bk.sub, emoji: '' }),
        (b.bookingUrl && WSENGINE.bookingEmbedOk(b.bookingUrl))
          ? mk('embed', { title: bk.head, text: '', url: b.bookingUrl, height: '720' })
          : mk('booking', { variant: bk.mode, title: '', text: '', button: bk.btn, services: svcNames, success: bk.ok }),
      ];
      pages.push({ id: 'pg-book', path: bk.path, title: bk.title, nav: true, sections: bsecs });
      b.bookShort = bk.short;
      b.bookLabel = bk.btn;
    }

    // ----- ABOUT: always present (story + any team/stats/gallery) so every site has a real About page -----
    const aboutSecs = [mk('pagehead', { title: 'About ' + (b.name || 'us'), text: (sc && sc.tagline) || b.tagline || '', emoji: '' })];
    // Use the generated intro here only if the home page didn't already claim it (no shared section objects / duplicate ids).
    if (intro && !homeUsedIntro) aboutSecs.push(intro);
    else aboutSecs.push(mk('intro', { variant: 'center', text: b.about || (sc && sc.about) || ('A little about ' + (b.name || 'us') + ' and what we do.'), emoji: '' }));
    stats.forEach((s) => aboutSecs.push(s));
    team.forEach((s) => aboutSecs.push(s));
    gallery.forEach((s) => aboutSecs.push(s));
    beforeafter.forEach((s) => aboutSecs.push(s));
    aboutSecs.push(mk('cta', { variant: 'band', title: v3FlavorPick(V3_COPY.aboutCta.title), text: v3FlavorPick(V3_COPY.aboutCta.text), button: b.bookLabel || 'Get in touch', link: '#/contact', emoji: '' }));
    pages.push({ id: 'pg-about', path: 'about', title: 'About', nav: true, sections: aboutSecs });

    // ----- CONTACT: form (to inbox), visit (hours/map), faq -----
    const contactSecs = [];
    const chText = b.city ? v3FlavorPick(V3_COPY.contactHead.textCity).replace('CITY', b.city) : v3FlavorPick(V3_COPY.contactHead.textNoCity);
    contactSecs.push(mk('pagehead', { title: v3FlavorPick(V3_COPY.contactHead.title), text: chText, emoji: '' }));
    contactSecs.push(mk('contact', { showPhone: true, title: v3FlavorPick(V3_COPY.formTitle), text: v3FlavorPick(V3_COPY.formText), success: v3FlavorPick(V3_COPY.formSuccess) }));
    if (visit && hasReach) { if (b.address) visit.variant = 'map'; contactSecs.push(visit); }
    if (faq) contactSecs.push(faq);
    pages.push({ id: 'pg-contact', path: 'contact', title: 'Contact', nav: true, sections: contactSecs });

    site.pages = pages;
    site.sections = home.slice();
  } catch (e) {}
  return site;
}

async function doCreate(request, env) {
  let body; try { body = await request.json(); } catch { return fail('Invalid request'); }
  try {
    const r = await buildV3Site(body || {}, env);
    const site = r.site, siteId = r.siteId, html = r.html;
    const formKey = await siteKey(siteId, env);
    try { if (env.KV) await env.KV.put('site:' + siteId, JSON.stringify(site), { expirationTtl: 60 * 60 * 24 * 30 }); } catch (e) {}
    try { if (env.KV) { const _sgC = await env.KV.get('stat:sitesgrown'); if (_sgC !== null) await env.KV.put('stat:sitesgrown', String((parseInt(_sgC, 10) || 0) + 1)); } } catch (e) {}
    try { await logEvent(request, env, 'create_v3', { type: site.biz.type, shop: r.isShop }); } catch (e) {}
    return succeed({ html: html, siteId: siteId, formKey: formKey, site: site, inboxUrl: 'https://websprout.app/inbox?site=' + siteId + '&key=' + formKey });
  } catch (e) { return fail(e.message); }
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

async function buildV3Site(d, env) {
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
      founded: (d.founded || '').toString().slice(0, 8),
      about: (d.about || '').toString().slice(0, 400),
      bookLabel: isShop ? 'Shop now' : 'Get in touch',
      bookShort: isShop ? 'Shop' : 'Contact',
      walkIns: true,
      hours: Array.isArray(d.hours) ? d.hours.slice(0, 7) : [],
      services: Array.isArray(d.services) ? d.services.slice(0, 12).map(function (s) { return { name: (s.name || '').toString().slice(0, 60), desc: (s.desc || s.specialty || '').toString().slice(0, 160), price: (s.price || '').toString().slice(0, 20) }; }) : [],
      team: Array.isArray(d.team) ? d.team.slice(0, 12).map(function (t) { return { name: (t.name || '').toString().slice(0, 60), specialty: (t.role || t.specialty || '').toString().slice(0, 80) }; }) : [],
      reviews: Array.isArray(d.reviews) ? d.reviews.slice(0, 12).map(function (r) { return { quote: (r.quote || '').toString().slice(0, 240), name: (r.name || '').toString().slice(0, 60) }; }) : [],
    };
    const sc = v3Starter(biz.type);
    const palette = (d.palette || '').toString() || sc.palette || 'w_mono';
    const typeset = (d.typeset || '').toString() || sc.typeset || 'bold';
    const emojiStyle = (d.emojiStyle || 'color').toString();
    const knownType = /barber|salon|tattoo|groom|nail|spa|beauty|bak|cafe|coffee|food|restaurant|kitchen|donut|truck|lawn|landscap|garden|clean|pressure|pool|window|pest|gutter|handy/i.test(biz.type);
    const has = function (a) { return Array.isArray(a) && a.length; };
    const site = { biz: biz, palette: palette, typeset: typeset, emojiStyle: emojiStyle, photos: {}, sections: [], statsApi: 'https://websprout.app/api/place' };
    const add = function (type, ov) { site.sections.push(Object.assign({ id: type + '-' + WSENGINE.uid(), type: type }, WSENGINE.sections[type].create(site), ov || {})); };
    // Fill a finished-feeling site from deterministic, type-aware starter content. The owner edits any of it.
    const heroTag = biz.tagline || sc.tagline || '';
    const aboutText = biz.about || sc.about || '';
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
      const _starter = (sc.services || []).map(function (s) { return { k: _norm(s[0]), text: s[1], emoji: s[2] || '' }; });
      let _recs = []; try { _recs = WSENGINE.emojiRecsFor(biz.type) || []; } catch (e) {}
      const _items = biz.services.filter(function (x) { return x.name; }).map(function (x, i) {
        const k = _norm(x.name);
        const hit = _starter.find(function (s) { return s.k && (s.k === k || (k.length > 3 && (s.k.indexOf(k) > -1 || k.indexOf(s.k) > -1))); });
        return { emoji: knownType ? ((hit && hit.emoji) || _recs[(i + 2) % (_recs.length || 1)] || '') : '', name: x.name, text: x.desc || (hit ? hit.text : ''), from: x.price || '' };
      });
      add('services', { variant: 'grid', title: sc.servicesTitle || 'What we do', items: _items });
    }
    else if (sc.services && sc.services.length) { add('services', { variant: 'grid', title: sc.servicesTitle || 'What we do', items: sc.services.map(function (s) { return { emoji: s[2] || '', name: s[0], text: s[1], from: '' }; }) }); }
    if (has(biz.reviews)) add('reviews', { variant: 'wall' });
    if (has(d.faq)) add('faq', { variant: 'accordion', items: d.faq.slice(0, 10).map(function (q) { return { q: (q.q || '').toString().slice(0, 160), a: (q.a || '').toString().slice(0, 400) }; }) });
    else if (sc.faq && sc.faq.length) add('faq', { variant: 'accordion', items: sc.faq.map(function (x) { return { q: x[0], a: x[1] }; }) });
    add('cta', isShop
      ? { variant: 'band', title: 'Shop the collection.', text: 'Browse everything and order online.', button: biz.bookLabel, emoji: '' }
      : { variant: 'band', title: sc.ctaTitle || "Let's get started.", text: sc.ctaText || "Reach out and we'll take it from here.", button: biz.bookLabel, emoji: '' });
    add('visit', { variant: 'hours' });
    // Topical photography (graceful: no key or any failure → designed gradient hero, no gallery).
    // One API call fills the hero plus a photo gallery, so sites read image-led, not template-flat.
    try {
      const _pics = await unsplashPhotos((PHOTO_QUERY[sc.category] || biz.type || 'small business'), env, 4);
      if (_pics.length) {
        const _h = site.sections.find(function (s) { return s.type === 'hero'; });
        site.photoCredits = {};
        const _cr = function (k, p) { site.photos[k] = p.url; site.photoCredits[k] = { name: p.name, link: p.link }; };
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
      }
    } catch (e) {}
    // Assign the site id up front so the contact form can bake its /api/form/<siteId> action.
    const siteId = 'ws' + Math.random().toString(36).slice(2, 9);
    site.siteId = siteId;
    // Build a real multi-page site (Home + Shop/Menu/Services + About + Contact) with cross-page nav.
    v3Pages(site, sc, isShop);
    const html = WSENGINE.renderSite(site, { mode: 'live' });
    return { site: site, siteId: siteId, html: html, isShop: isShop };
  }
}
