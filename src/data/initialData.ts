import { 
  Project, 
  Service, 
  Testimonial, 
  TeamMember, 
  BlogPost, 
  SiteSettings, 
  QuoteRequest, 
  ContactMessage, 
  Profile 
} from '../types/database';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'settings-001',
  company_name: 'ApexBuild Engineering & Construction',
  tagline: 'Precision Civil Engineering & High-End Construction Across East Africa',
  logo_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop&q=80',
  phone: '+254 (0) 20 780 4000',
  phone_secondary: '+254 700 889 900',
  email: 'contracts@apexbuild.co.ke',
  address: 'Apex Tower, 8th Floor, Chiromo Road, Westlands',
  city: 'Nairobi',
  country: 'Kenya',
  whatsapp_number: '+254700889900',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.364604543162!2d36.804245!3d-1.267499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c3339171b%3A0xe54e601274577884!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske',
  business_hours: 'Monday – Friday: 7:30 AM – 5:30 PM | Saturday: 8:00 AM – 1:00 PM',
  about_summary: 'ApexBuild is a premier Tier-1 (NCA 1) civil engineering and general contracting firm headquartered in Nairobi, Kenya. With over 18 years of continuous operational excellence, we deliver landmark infrastructure, commercial high-rises, master-planned residential estates, and complex civil engineering projects across East and Central Africa.',
  mission: 'To deliver superior infrastructure and architectural landmarks that drive economic progress, uphold unyielding structural integrity, and ensure zero-harm safety for every worker and community.',
  vision: 'To be East Africa’s most trusted, technologically advanced, and environmentally sustainable engineering and construction powerhouse.',
  core_values: [
    'Zero-Harm Safety Standard',
    'Uncompromising Engineering Rigor',
    'Total Budget & Schedule Transparency',
    'Sustainable & EDGE-Certified Building',
    'Community-First Impact'
  ],
  social_facebook: 'https://facebook.com/apexbuildke',
  social_linkedin: 'https://linkedin.com/company/apexbuild-kenya',
  social_twitter: 'https://twitter.com/apexbuild_ke',
  social_instagram: 'https://instagram.com/apexbuild_construction',
  currency: 'KES',
  updated_at: new Date().toISOString()
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-001',
    title: 'Commercial & High-Rise Construction',
    slug: 'commercial-high-rise-construction',
    short_description: 'Turnkey development of Grade-A office towers, shopping malls, institutional complexes, and hospitality facilities.',
    description: 'We offer full-lifecycle engineering, procurement, and construction (EPC) for modern commercial developments. From complex deep-basement excavation in dense urban centers to post-tensioned reinforced concrete superstructures and high-performance curtain-wall facades, ApexBuild ensures on-budget, on-time delivery with full NCA and international structural compliance.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    icon: 'Building2',
    category: 'Commercial',
    features: [
      'Deep basement shoring & piling systems',
      'Post-tensioned concrete structural frames',
      'Curtain walling & double-glazed acoustic facades',
      'Integrated BMS, HVAC, & smart fire suppression systems',
      'LEED & EDGE green building compliance'
    ],
    active: true,
    display_order: 1,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-002',
    title: 'Civil Engineering & Heavy Infrastructure',
    slug: 'civil-engineering-heavy-infrastructure',
    short_description: 'Highways, arterial road dualing, stormwater drainage networks, bridge structures, and earthworks.',
    description: 'Our heavy civil engineering division operates a dedicated in-house fleet of earthmoving, asphalt paving, and piling machinery. We construct national highways, industrial access corridors, bridge crossings, bulk earthworks, and municipal stormwater canals engineered for heavy axle loads and climate resilience.',
    image_url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&auto=format&fit=crop&q=80',
    icon: 'HardHat',
    category: 'Civil Works',
    features: [
      'Asphalt concrete & rigid concrete road paving',
      'Box culverts, storm canals & retaining walls',
      'Bridge abutments and post-tensioned flyovers',
      'Bulk site grading and geotechnical soil stabilization',
      'NCA 1 certified heavy plant & equipment fleet'
    ],
    active: true,
    display_order: 2,
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-003',
    title: 'Luxury Residential & Gated Communities',
    slug: 'luxury-residential-gated-communities',
    short_description: 'Bespoke contemporary villas, master-planned gated estates, and high-density luxury residential apartment towers.',
    description: 'We transform architectural dreams into lasting sanctuaries. Our residential wing specializes in turnkey villa construction, high-end gated developments, and contemporary multi-storey residential towers. We manage everything from foundation casting and structural framing to imported marble finishes, smart home automation, and perimeter security infrastructure.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    icon: 'Home',
    category: 'Residential',
    features: [
      'Architectural concrete & bespoke stone masonry',
      'Underground rainwater harvesting & solar water systems',
      'Infinity pools & structural landscape engineering',
      'Premium European sanitary & joinery installations',
      'Full 10-year structural warranty'
    ],
    active: true,
    display_order: 3,
    created_at: new Date(Date.now() - 86400000 * 26).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-004',
    title: 'Industrial Facilities & Logistics Hubs',
    slug: 'industrial-facilities-logistics-hubs',
    short_description: 'Pre-engineered steel portal frames, cold-storage warehouses, factory floors, and heavy distribution centers.',
    description: 'Engineered for logistics velocity and heavy floor loading. We construct wide-span pre-engineered steel buildings (PEB), high-tolerance laser-screeded industrial concrete floors, overhead gantry crane structures, automated loading docks, and temperature-controlled cold chain logistics facilities.',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    icon: 'Warehouse',
    category: 'Industrial',
    features: [
      'Wide clear-span structural steel framing (up to 45m)',
      'High-flatness FM2 laser-screed concrete flooring',
      'Heavy vehicle loading bays & dock levelers',
      'Industrial fire sprinkler reservoirs & pump systems',
      'Solar PV roof integration capacity'
    ],
    active: true,
    display_order: 4,
    created_at: new Date(Date.now() - 86400000 * 24).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-005',
    title: 'Structural Renovation & Retrofitting',
    slug: 'structural-renovation-retrofitting',
    short_description: 'Adaptive reuse, seismic reinforcement, carbon fiber (CFRP) structural wrapping, and heritage restorations.',
    description: 'Revitalizing existing buildings with modern engineering standards. We specialize in carbon-fiber polymer structural strengthening, foundation underpinning, internal space reconfiguration, mechanical retrofitting, and converting aged commercial properties into modern, energy-efficient assets.',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80',
    icon: 'Hammer',
    category: 'Renovation',
    features: [
      'Carbon-fiber reinforced polymer (CFRP) strengthening',
      'Micropile foundation underpinning',
      'Non-destructive structural integrity scanning',
      'Full MEP stripping & green energy upgrading',
      'Heritage preservation masonry repair'
    ],
    active: true,
    display_order: 5,
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-006',
    title: 'Project Management & Engineering Advisory',
    slug: 'project-management-engineering-advisory',
    short_description: 'Comprehensive FIDIC contract administration, quantity surveying, value engineering, and site QA/QC supervision.',
    description: 'Guiding clients through complex capital expenditure projects. Our multidisciplinary engineers provide Feasibility Studies, Bill of Quantities (BOQ) preparation, Tender Management, Construction Scheduling (Primavera P6 & BIM 4D), and stringent third-party quality audits.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    icon: 'ClipboardCheck',
    category: 'Consultancy',
    features: [
      'BIM 3D/4D clash detection & constructability reviews',
      'Strict budget control & quantity surveying verification',
      'FIDIC & JBCC contract administration',
      'Daily site logs & drone aerial progress telemetry',
      'Regulatory statutory approvals (NEMA, NCA, County Gov)'
    ],
    active: true,
    display_order: 6,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-001',
    title: 'Upper Hill Horizon Commercial Tower',
    slug: 'upper-hill-horizon-commercial-tower',
    short_description: '28-storey Grade-A commercial office tower with 4-level subterranean automated parking and EDGE Gold certification.',
    description: 'A benchmark development in Nairobi’s financial district. The Upper Hill Horizon Tower features 35,000 m² of prime commercial space, a double-curved unitized curtain wall, high-speed destination-controlled elevators, and full rooftop solar energy generation. ApexBuild completed the project 6 weeks ahead of schedule with over 1.2 million safe work hours logged.',
    location: 'Upper Hill, Nairobi, Kenya',
    client: 'Horizon Real Estate Holdings Ltd',
    project_type: 'Commercial',
    status: 'Completed',
    start_date: '2023-02-15',
    completion_date: '2025-11-30',
    budget: 'KES 2.85 Billion ($22.1M)',
    cover_image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      'Deep excavation (18 meters) with contiguous secant piling',
      'Post-tensioned concrete slabs throughout 28 floors',
      'High-performance acoustic facade engineering',
      'Dual generator synchronization & 250kW solar array',
      'Full EDGE Gold sustainable building certification'
    ],
    created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-001',
        project_id: 'prj-001',
        image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
        caption: 'Architectural exterior facade view during dusk golden hour',
        display_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 'img-002',
        project_id: 'prj-001',
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
        caption: 'Main ground reception atrium with imported Italian travertine stone',
        display_order: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 'img-003',
        project_id: 'prj-001',
        image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
        caption: 'Structural frame casting with heavy-duty tower cranes on site',
        display_order: 3,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'prj-002',
    title: 'Karen Sanctuary Luxury Villas Estate',
    slug: 'karen-sanctuary-luxury-villas-estate',
    short_description: 'Exclusive enclave of 14 ultra-luxury contemporary 5-bedroom villas set across 10 lush manicured acres.',
    description: 'Nestled in Karen, Nairobi, this gated residential community balances contemporary bioclimatic architecture with natural indigenous stone and timber aesthetics. Each residence encompasses 650 m² of living area, complete with heated private pool, geothermal cooling, triple-glazed floor-to-ceiling windows, and advanced biometric smart access.',
    location: 'Karen, Nairobi, Kenya',
    client: 'Sanctuary Living Development PLC',
    project_type: 'Residential',
    status: 'Completed',
    start_date: '2023-06-01',
    completion_date: '2025-04-15',
    budget: 'KES 1.45 Billion ($11.2M)',
    cover_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      'Turnkey civil & structural villa construction',
      'Internal paved estate roads with solar streetlighting',
      'Private 100,000L subterranean rainwater cisterns per unit',
      'Custom artisan timber pergolas & imported porcelain finishes',
      'Clubhouse, fitness gym, and tennis court construction'
    ],
    created_at: new Date(Date.now() - 86400000 * 150).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-004',
        project_id: 'prj-002',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        caption: 'Villa facade showing cantilevered master terrace and pool lounge',
        display_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 'img-005',
        project_id: 'prj-002',
        image_url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&auto=format&fit=crop&q=80',
        caption: 'High-ceiling open plan living pavilion with minimalist kitchen island',
        display_order: 2,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'prj-003',
    title: 'Mombasa Gateway Logistics & Cold Chain Hub',
    slug: 'mombasa-gateway-logistics-cold-chain-hub',
    short_description: '22,000 m² high-throughput bonded distribution warehouse with solar microgrid and pharma cold storage.',
    description: 'Constructed adjacent to the Port of Mombasa corridor to handle high-volume import/export cargo. The facility utilizes heavy structural steel portal frames with 36-meter clear spans, superflat FM2 industrial flooring, 18 automated loading docks, and a pharmaceutical-grade multi-temperature cold storage facility powered by a 500kW rooftop solar microgrid.',
    location: 'Miritini, Mombasa, Kenya',
    client: 'East Africa Gateway Logistics Ltd',
    project_type: 'Industrial',
    status: 'Completed',
    start_date: '2024-01-10',
    completion_date: '2025-08-20',
    budget: 'KES 980 Million ($7.6M)',
    cover_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      'Heavy structural steel fabrication & erection (1,400 tonnes)',
      'Laser-screeded industrial floor with dry-shake metallic hardener',
      '-25°C to +4°C cold room refrigeration system insulation',
      'Heavy-duty interlock concrete paving for 40ft container chassis',
      'Custom fire protection deluge sprinkler system'
    ],
    created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prj-004',
    title: 'Kisumu–Kakamega Highway Dualing & Bridges',
    slug: 'kisumu-kakamega-highway-dualing-bridges',
    short_description: '14.5 km national highway expansion, 3 river bridge crossings, and grade-separated roundabout interchanges.',
    description: 'A vital economic artery connecting Western Kenya to the Northern Corridor. ApexBuild handled the earthworks, drainage infrastructure, sub-base stabilization, asphalt concrete wearing course laying, and the engineering of three 45-meter prestressed concrete beam bridges designed to withstand 100-year flood levels.',
    location: 'Kisumu County, Kenya',
    client: 'Kenya National Highways Authority (KeNHA)',
    project_type: 'Civil Works',
    status: 'In Progress',
    start_date: '2024-05-01',
    completion_date: '2026-12-15',
    budget: 'KES 3.4 Billion ($26.3M)',
    cover_image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      '14.5km dual carriageway asphalt paving (Superpave spec)',
      '3 reinforced concrete girder bridges over permanent rivers',
      '24,000 meters of concrete lined trapezoidal storm drains',
      'Pedestrian footbridges and protected non-motorized transport lanes',
      'Continuous geotechnical soil compaction testing'
    ],
    created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prj-005',
    title: 'Kilimani Apex Suites & Medical Centre',
    slug: 'kilimani-apex-suites-medical-centre',
    short_description: '18-storey mixed-use development featuring specialized diagnostic medical suites and executive residences.',
    description: 'Designed to integrate international healthcare standards with luxury living. The first 6 floors house radiation-shielded diagnostic radiology suites, surgical clinics, and laboratory spaces, while the upper 12 floors feature contemporary executive serviced apartments.',
    location: 'Kilimani, Nairobi, Kenya',
    client: 'Apex Health Properties JV',
    project_type: 'Commercial',
    status: 'In Progress',
    start_date: '2024-08-15',
    completion_date: '2026-10-30',
    budget: 'KES 1.85 Billion ($14.3M)',
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Lead-lined radiological shielding construction',
      'Medical gas piping & specialized cleanroom HVAC filters',
      'Vibration-isolated structural medical imaging floors',
      'Triple redundant UPS electrical power architecture'
    ],
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prj-006',
    title: 'Naivasha Geothermal Substation Civil Works',
    slug: 'naivasha-geothermal-substation-civil-works',
    short_description: 'Heavy foundation civil engineering, transformer bunds, blast walls, and security control facility.',
    description: 'Precision civil works in high-temperature volcanic terrain. We executed mass concrete foundations, anti-vibration transformer pads, reinforced concrete blast containment walls, and heavy equipment access roads for a 140MW geothermal power expansion facility.',
    location: 'Olkaria, Naivasha, Kenya',
    client: 'Kenya Electricity Generating Company',
    project_type: 'Civil Works',
    status: 'Completed',
    start_date: '2023-09-01',
    completion_date: '2024-11-15',
    budget: 'KES 720 Million ($5.5M)',
    cover_image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Sulfate-resistant C35/45 mass concrete placement',
      'Blast-resistant control room bunker architecture',
      'High-voltage cable trench network (over 8,000m)',
      'Subsurface oil-water separator drainage containment'
    ],
    created_at: new Date(Date.now() - 86400000 * 40).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tst-001',
    customer_name: 'Eng. Peter Kimani',
    company: 'Director of Infrastructure, Horizon Holdings Ltd',
    project_title: 'Upper Hill Horizon Commercial Tower',
    content: 'ApexBuild demonstrated extraordinary technical skill on our 28-storey tower. Deep excavation in Westlands/Upper Hill can be fraught with geotechnical surprises, but their engineering team managed retaining walls and structural casting with surgical precision. They finished 6 weeks ahead of schedule.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    featured: true,
    active: true,
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tst-002',
    customer_name: 'Brenda Odhiambo',
    company: 'Managing Partner, Sanctuary Living PLC',
    project_title: 'Karen Sanctuary Estate',
    content: 'Building 14 luxury bespoke homes requires an obsession with finishing quality. ApexBuild’s project managers were on site every morning, strictly enforcing safety and quality benchmarks. Their transparent weekly cost accounting gave our investors complete peace of mind.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    featured: true,
    active: true,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tst-003',
    customer_name: 'Hassan Al-Nuaimi',
    company: 'Chief Logistics Officer, EA Gateway Logistics',
    project_title: 'Mombasa Gateway Hub',
    content: 'The 22,000m² warehouse and cold chain facility in Mombasa was delivered with zero lost-time incidents over 450,000 labor hours. Their structural steel engineering and superflat concrete flooring easily met our international shipping standards.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    featured: true,
    active: true,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-001',
    name: 'Eng. David Mwangi, PE, MIEK',
    position: 'Managing Director & Lead Structural Engineer',
    biography: 'Over 22 years of structural engineering mastery across Eastern and Southern Africa. Fellow of the Institution of Engineers of Kenya (IEK) and registered with Engineers Board of Kenya (EBK). Lead consultant on over $200M worth of high-rise and civil projects.',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    email: 'd.mwangi@apexbuild.co.ke',
    phone: '+254 722 100 200',
    linkedin_url: 'https://linkedin.com',
    display_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'team-002',
    name: 'Arch. Grace Wanjiru, B.Arch, AAK',
    position: 'Chief Operations Officer & Principal Architect',
    biography: 'Graduate of the University of Nairobi with master’s in Sustainable Architecture (University of Cape Town). Oversees turnkey project delivery, BIM coordination, and contract administration across all regional active construction sites.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    email: 'g.wanjiru@apexbuild.co.ke',
    phone: '+254 722 300 400',
    linkedin_url: 'https://linkedin.com',
    display_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'team-003',
    name: 'Eng. Brian Ochieng, BSc. Civ, PMP',
    position: 'Head of Civil Infrastructure & Heavy Plant',
    biography: '16 years directing major highway concessions, bridge construction, and bulk earthworks. Specializes in soil-structure interaction, geotechnical stabilization, and automated fleet telematics.',
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    email: 'b.ochieng@apexbuild.co.ke',
    phone: '+254 722 500 600',
    linkedin_url: 'https://linkedin.com',
    display_order: 3,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'team-004',
    name: 'Fatuma Hassan, MSc. HSE, NEBOSH',
    position: 'Director of Health, Safety & Quality Assurance',
    biography: 'Certified NEBOSH International Diploma holder leading our Zero-Harm safety program. Achieved over 3.8 million consecutive safe working hours without a lost-time injury across our active urban projects.',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    email: 'f.hassan@apexbuild.co.ke',
    phone: '+254 722 700 800',
    linkedin_url: 'https://linkedin.com',
    display_order: 4,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-001',
    title: 'Modern Seismic & Wind Load Engineering in Nairobi High-Rise Construction',
    slug: 'seismic-wind-load-engineering-nairobi-high-rises',
    excerpt: 'How advanced post-tensioned slabs, shear-wall optimization, and Eurocode 8 standards protect skyscrapers in the East African Rift tectonic zone.',
    content: `## The Evolution of Structural Engineering in East Africa

As Nairobi's skyline climbs rapidly with 25 to 40-storey commercial and residential towers, structural engineers are confronted with unique geological and meteorological conditions. The Great Rift Valley fault systems require rigorous attention to dynamic seismic response, while upper-atmosphere wind sheer demands refined aerodynamic massing.

### 1. Soil-Structure Interaction in Upper Hill and Westlands
Nairobi’s geology varies significantly within just a few kilometers. While Upper Hill is anchored by stable phonolite bedrock, areas around Westlands and Parklands often present thick volcanic clays (black cotton soils) overlying weathered tuff. 

At ApexBuild, our structural protocol begins with:
* Multi-depth continuous core rotary drilling
* Downhole seismic testing for shear wave velocity ($V_s30$)
* Contiguous secant piling with pre-stressed ground anchors

### 2. The Advantages of Post-Tensioned (PT) Slabs
Post-tensioned concrete construction allows our projects to achieve thinner slab depths (saving up to 20% in concrete mass), longer clear spans without obstructive intermediate columns, and superior crack control under cyclic thermal loading.

### 3. Sustainable Concrete Mix Designs
We utilize GGBS (Ground Granulated Blast-furnace Slag) and fly-ash blended cements to reduce the carbon footprint of structural pours by up to 35% while improving resistance to chemical sulfate attack in subterranean foundations.`,
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    author_name: 'Eng. David Mwangi, PE',
    category: 'Structural Engineering',
    read_time: '6 min read',
    published: true,
    published_at: '2026-06-12T10:00:00Z',
    created_at: '2026-06-12T10:00:00Z',
    updated_at: '2026-06-12T10:00:00Z'
  },
  {
    id: 'post-002',
    title: 'EDGE & LEED Green Building in Kenya: Financial Returns & Environmental Imperatives',
    slug: 'edge-leed-green-building-kenya-financial-returns',
    excerpt: 'Why institutional property developers in Kenya are achieving 18% higher rental premiums and 25% lower lifecycle utility expenses through sustainable design.',
    content: `## Sustainable Construction is No Longer Optional

Global capital allocators and international tenants (multinationals, diplomatic missions, and leading tech companies) now demand verified ESG credentials before signing commercial leases. In Kenya, the **EDGE (Excellence in Design for Greater Efficiencies)** standard developed by the IFC has become the gold standard.

### Three Pillars of EDGE Certification:
1. **Direct Energy Savings (Minimum 20%):** Utilizing double-glazed low-emissivity glass, solar PV shading, energy-efficient HVAC chillers, and daylight-harvesting LED networks.
2. **Water Efficiency (Minimum 20%):** Low-flow aerated plumbing fixtures, rainwater harvesting cisterns, and on-site greywater treatment plants for toilet flushing and landscape irrigation.
3. **Embodied Carbon in Materials (Minimum 20%):** Sourcing localized stone, hollow clay blocks, and recycled structural steel.

Developers partner with ApexBuild because our in-house BIM (Building Information Modeling) specialists simulate solar insolation and thermal envelope performance before the first cubic meter of concrete is poured.`,
    cover_image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?w=1200&auto=format&fit=crop&q=80',
    author_name: 'Arch. Grace Wanjiru',
    category: 'Sustainability & Green Building',
    read_time: '5 min read',
    published: true,
    published_at: '2026-07-04T08:30:00Z',
    created_at: '2026-07-04T08:30:00Z',
    updated_at: '2026-07-04T08:30:00Z'
  },
  {
    id: 'post-003',
    title: 'Navigating NCA 1 Compliance & Building Statutory Approvals in Kenya',
    slug: 'navigating-nca-1-compliance-statutory-approvals-kenya',
    excerpt: 'A comprehensive developer’s guide to NEMA Environmental Impact Assessments, County Government building permits, and National Construction Authority site registration.',
    content: `## Avoiding Costly Site Stoppages

Regulatory enforcement on construction sites across Kenyan urban centers has reached historic rigor. The National Construction Authority (NCA) and County Governments frequently shut down non-compliant sites that lack registered structural engineers, accredited site supervisors, or verified HSE equipment.

### The Mandatory Statutory Checklist:
1. **NEMA (National Environment Management Authority):** Environmental & Social Impact Assessment (ESIA) license before any earth-moving equipment touches the site.
2. **County Government Development Approval:** Architectural, structural, and public health approval stamps.
3. **National Construction Authority (NCA):** Project registration, verified contractor certification (Category NCA 1 for unlimited contract values), and NCA-accredited site supervisor badges.
4. **Water Resources Authority (WRA):** Groundwater extraction permits for commercial boreholes and riparian boundary verifications.

ApexBuild provides comprehensive statutory advisory to all our clients, managing the regulatory pipeline end-to-end to ensure zero site shutdowns.`,
    cover_image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80',
    author_name: 'Eng. Brian Ochieng, PMP',
    category: 'Regulations & Compliance',
    read_time: '7 min read',
    published: true,
    published_at: '2026-08-01T14:15:00Z',
    created_at: '2026-08-01T14:15:00Z',
    updated_at: '2026-08-01T14:15:00Z'
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'qte-1001',
    user_id: 'usr-demo-001',
    name: 'Samuel Kiprop',
    email: 's.kiprop@primecommercial.co.ke',
    phone: '+254 712 345 678',
    company: 'Prime Commercial Properties Ltd',
    project_type: 'Commercial',
    location: 'Westlands, Nairobi',
    budget: 'KES 450 Million ($3.5M)',
    estimated_area: '6,500 m²',
    preferred_start_date: '2026-10-01',
    description: 'Construction of a 10-storey commercial office plaza with two basement parking levels. Architectural drawings ready; seeking Tier 1 contractor for turnkey structural, MEP and facade works.',
    status: 'Site Visit Scheduled',
    admin_notes: 'Initial drawings reviewed by Eng. Mwangi. Site visit scheduled for Friday 10:00 AM with the client’s QS team.',
    attachments: ['https://example.com/drawings/westlands-office-rev3.pdf'],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'qte-1002',
    user_id: 'usr-demo-002',
    name: 'Dr. Amina Mohamed',
    email: 'amina.m@gmail.com',
    phone: '+254 733 987 654',
    company: 'Private Residence',
    project_type: 'Residential',
    location: 'Runda Estate, Nairobi',
    budget: 'KES 85 Million ($650k)',
    estimated_area: '800 m²',
    preferred_start_date: '2026-11-15',
    description: 'Bespoke 6-bedroom contemporary residence with rooftop lounge, swimming pool, and solar power integration on half-acre plot.',
    status: 'Reviewing',
    admin_notes: 'Arch. Grace assigned for concept design review and preliminary BOQ estimation.',
    attachments: [],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'qte-1003',
    user_id: null,
    name: 'Michael Karanja',
    email: 'm.karanja@agrilogistics.com',
    phone: '+254 720 112 233',
    company: 'AgriLogistics East Africa',
    project_type: 'Industrial',
    location: 'Athi River, Machakos',
    budget: 'KES 180 Million ($1.4M)',
    estimated_area: '4,000 m²',
    preferred_start_date: '2026-12-01',
    description: 'Steel portal frame warehouse for agricultural export cold storage with 12m clear height.',
    status: 'New',
    admin_notes: null,
    attachments: [],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-001',
    name: 'Sarah Maina',
    email: 's.maina@investmentfund.ke',
    phone: '+254 722 888 999',
    subject: 'RFP for 200-Unit Residential Masterplan in Kiambu',
    message: 'Greetings ApexBuild team. We represent an international institutional pension fund preparing an RFP for a 200-unit gated estate in Kiambu. We would like to invite your firm to prequalify as main contractor.',
    status: 'unread',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'msg-002',
    name: 'Patrick Mwenda',
    email: 'pmwenda@consulting.co.ke',
    phone: '+254 701 555 444',
    subject: 'Structural Integrity Assessment for Old CBD Building',
    message: 'We require a structural audit and non-destructive load testing for a 6-storey building in Nairobi CBD for potential retrofitting and expansion.',
    status: 'read',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-admin-001',
    full_name: 'Eng. David Mwangi (Admin)',
    email: 'admin@apexbuild.co.ke',
    phone: '+254 722 100 200',
    company_name: 'ApexBuild Engineering',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 365).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'usr-manager-001',
    full_name: 'Arch. Grace Wanjiru (Manager)',
    email: 'manager@apexbuild.co.ke',
    phone: '+254 722 300 400',
    company_name: 'ApexBuild Operations',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'manager',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 200).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'usr-demo-001',
    full_name: 'Samuel Kiprop',
    email: 'customer@apexbuild.co.ke',
    phone: '+254 712 345 678',
    company_name: 'Prime Commercial Properties',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'customer',
    active: true,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString()
  }
];
