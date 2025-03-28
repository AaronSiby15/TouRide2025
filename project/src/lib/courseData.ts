export interface Module {
  id: string;
  title: string;
  content: string;
  duration: number; // in minutes
  videoUrl?: string; // Optional video URL for modules that have video content
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export const courseModules: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Canadian Driving",
    content: `Welcome to Canadian driving basics! This module covers essential information for new drivers in Canada.

Key Topics:
1. Road Signs and Traffic Signals
- Stop signs are red octagons and require a complete stop
- Yield signs are triangular and mean give way to other traffic
- Traffic lights follow the standard Red (stop), Yellow (prepare to stop), Green (go) system
- School zone signs indicate reduced speed limits
- Construction zone signs require extra caution and reduced speeds
- Merge signs indicate lanes joining ahead

[IMAGE: Roadsigns]

2. Right-Hand Driving
- In Canada, vehicles drive on the right side of the road
- Pass other vehicles on the left
- Keep right except when passing
- Use turn signals when changing lanes
- Check blind spots before lane changes
- Maintain safe following distance

[IMAGE: traffic_direction]

3. Speed Limits
- Posted in kilometers per hour (km/h)
- Common limits:
  • School zones: 30-40 km/h
  • Residential areas: 40-50 km/h
  • Major roads: 60-70 km/h
  • Highways: 100-110 km/h
- Adjust speed for weather conditions
- Reduce speed in construction zones
- Special speed limits for trucks and buses

[IMAGE: speed_limits]`,
    duration: 15,
    videoUrl: "https://youtu.be/Ue4UcsZnEv0?si=gqa79GYyCIMARmwv&t=378",
    quiz: [
      {
        question: "What does a red octagonal sign mean in Canada?",
        options: ["Yield to traffic", "Complete stop required", "Slow down", "Merge ahead"],
        correctAnswer: 1
      },
      {
        question: "What is the typical speed limit in Canadian school zones?",
        options: ["20-30 km/h", "30-40 km/h", "50-60 km/h", "70-80 km/h"],
        correctAnswer: 1
      },
      {
        question: "When passing other vehicles in Canada, you should:",
        options: [
          "Pass on the right side",
          "Pass on the left side",
          "Pass on either side",
          "Only pass in school zones"
        ],
        correctAnswer: 1
      },
      {
        question: "What should you do when approaching a yellow traffic light?",
        options: [
          "Speed up to get through",
          "Stop immediately",
          "Prepare to stop if safe to do so",
          "Ignore it if no other cars are present"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "module-2",
    title: "Road Rules and Regulations",
    content: `This module covers essential road rules and regulations in Canada.

1. Right of Way Rules
- Yield to emergency vehicles with sirens and lights
- Yield to pedestrians at crosswalks
- First to stop at 4-way stop has right of way
- Yield to vehicles already in a roundabout
- Right of way for emergency vehicles:
  • Pull over to the right when safe
  • Stop until emergency vehicle passes
  • Don't block intersections
- Yield to public transit buses signaling to re-enter traffic

[IMAGE: rightofway]

2. Parking Rules
- No parking within 5 meters of fire hydrants
- No parking in front of driveways
- Pay attention to parking signs and meters
- Winter parking restrictions may apply
- Accessible parking spaces require permits
- No parking:
  • Near bus stops
  • On bridges or in tunnels
  • In front of fire stations
  • In bicycle lanes

[IMAGE: parkingrules]

3. Safe Following Distance
- Maintain 2-3 seconds following distance in good conditions
- Increase distance in poor weather
- Use the "two-second rule": pick a fixed point and count
- Double distance at night or in bad weather
- Additional considerations:
  • Increase distance when following motorcycles
  • Allow extra space for large vehicles
  • Adjust for road conditions
  • Consider vehicle stopping distance

[IMAGE: safedistance]`,
    duration: 15,
    videoUrl: "https://youtu.be/Ue4UcsZnEv0?si=gqa79GYyCIMARmwv&t=378",
    quiz: [
      {
        question: "What is the minimum safe following distance in good weather conditions?",
        options: ["1 second", "2-3 seconds", "5 seconds", "10 seconds"],
        correctAnswer: 1
      },
      {
        question: "How far should you park from a fire hydrant?",
        options: ["3 meters", "5 meters", "7 meters", "10 meters"],
        correctAnswer: 1
      },
      {
        question: "What should you do when an emergency vehicle approaches with sirens on?",
        options: [
          "Speed up to get out of the way",
          "Stop immediately where you are",
          "Pull over to the right when safe and stop",
          "Continue driving normally"
        ],
        correctAnswer: 2
      },
      {
        question: "When should you double your following distance?",
        options: [
          "When driving in a school zone",
          "When following a motorcycle",
          "During rush hour",
          "During night or bad weather"
        ],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "module-3",
    title: "Safety and Emergency Procedures",
    content: `Learn essential safety procedures and emergency responses for Canadian roads.

1. Winter Driving
- Install winter tires when temperature drops below 7°C
- Keep emergency kit in vehicle containing:
  • Shovel and ice scraper
  • Jumper cables
  • Flashlight and batteries
  • First aid kit
  • Blankets and warm clothing
- Clear all snow and ice from vehicle before driving
- Increase following distance on slippery roads
- Winter driving techniques:
  • Gentle acceleration and braking
  • Steer smoothly and gradually
  • Plan turns well in advance
  • Watch for black ice

[IMAGE: snowstorm]

2. Emergency Procedures
- If your vehicle breaks down:
  • Pull over to the shoulder
  • Turn on hazard lights
  • Stay in your vehicle if safe
  • Call for assistance
  • Place warning triangles if available
- In case of accidents:
  • Ensure safety first
  • Call emergency services if needed
  • Exchange information with other drivers
  • Document the scene
  • Take photos of damage
  • File police report if required

[IMAGE: emergencylight]

3. Impaired Driving
- Zero tolerance for alcohol or drugs while driving
- Severe penalties including:
  • License suspension
  • Fines
  • Possible jail time
  • Criminal record
- Plan ahead for safe transportation:
  • Designated driver
  • Taxi or ride-sharing
  • Public transit
  • Stay overnight
- Recognize signs of fatigue:
  • Difficulty focusing
  • Heavy eyelids
  • Wandering thoughts
  • Missing exits or turns

[IMAGE: impaireddriving]`,
    duration: 15,
    videoUrl: "https://youtu.be/pzVDhGjMH9g?si=45SuS63prLP7JihL&t=103",
    quiz: [
      {
        question: "At what temperature should you install winter tires?",
        options: [
          "Below 0°C",
          "Below 7°C",
          "Below 10°C",
          "Only when snow is present"
        ],
        correctAnswer: 1
      },
      {
        question: "What should you do first if your vehicle breaks down?",
        options: [
          "Call for help immediately",
          "Exit the vehicle to check the engine",
          "Pull over to the shoulder and turn on hazard lights",
          "Wait for another driver to stop"
        ],
        correctAnswer: 2
      },
      {
        question: "Which is NOT a sign of driver fatigue?",
        options: [
          "Difficulty focusing",
          "Heavy eyelids",
          "Singing along to music",
          "Missing exits"
        ],
        correctAnswer: 2
      },
      {
        question: "What should be included in a winter emergency kit?",
        options: [
          "Summer tires",
          "Beach umbrella",
          "Shovel and ice scraper",
          "Air conditioning unit"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "module-4",
    title: "Highway & Lane Use Rules",
    content: `Learn essential highway driving and lane usage rules for safe travel on Canadian roads.

1. Highway Lane Usage
- Left lane on highways is for passing only
- Slow-moving vehicles should stay in the right lane
- Middle lanes for consistent speed travel
- Proper lane changing procedure:
  • Check mirrors and blind spots
  • Signal intention
  • Ensure safe gap
  • Change lanes smoothly
- Maintain consistent speed in your lane
- Watch for merging traffic

[IMAGE: highway]

2. Merging and Exiting
- Proper highway merging:
  • Match highway speed on acceleration lane
  • Signal early
  • Look for safe gap
  • Merge smoothly without stopping
- Safe highway exiting:
  • Plan ahead for your exit
  • Move to right lane early
  • Signal well in advance
  • Maintain speed until exit ramp
  • Reduce speed on the ramp

[IMAGE: merge]

3. Special Highway Considerations
- High-Occupancy Vehicle (HOV) lanes:
  • Minimum 2 occupants required
  • Watch for designated entry/exit points
  • Observe time restrictions
- Emergency vehicles and shoulders:
  • Move over for emergency vehicles
  • Use shoulders for emergencies only
  • Watch for disabled vehicles
- Construction zones:
  • Reduce speed
  • Follow posted signs
  • Watch for workers

[IMAGE: workhighway]`,
    duration: 15,
    quiz: [
      {
        question: "What is the primary purpose of the left lane on highways?",
        options: [
          "Regular travel",
          "Passing other vehicles",
          "Slow-moving vehicles",
          "Emergency vehicles only"
        ],
        correctAnswer: 1
      },
      {
        question: "When merging onto a highway, you should:",
        options: [
          "Stop and wait for a gap",
          "Drive slowly until fully merged",
          "Match the highway speed",
          "Use your horn to alert others"
        ],
        correctAnswer: 2
      },
      {
        question: "What is required to use an HOV (High-Occupancy Vehicle) lane?",
        options: [
          "A special permit",
          "Minimum 2 occupants",
          "An electric vehicle",
          "Payment of toll"
        ],
        correctAnswer: 1
      },
      {
        question: "When should you move to the right lane for a highway exit?",
        options: [
          "Just before the exit",
          "When you see the exit",
          "Well in advance",
          "Only if traffic is heavy"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "module-5",
    title: "Special Driving Conditions",
    content: `Master driving in special conditions and situations unique to Canadian roads.

1. School Zone Safety
- Reduced speed limits in effect
- Watch for children and crossing guards
- Stop for school buses with flashing lights:
  • Stop at least 20 meters behind
  • Wait until lights stop flashing
  • Watch for children crossing
- No passing in school zones
- Extra caution during arrival/dismissal times

[IMAGE: school]

2. Emergency Vehicle Protocol
- When emergency vehicles approach:
  • Pull over to the right when safe
  • Stop until they pass
  • Don't block intersections
  • Stay at least 150m behind
- Move over law:
  • Slow down when passing stopped emergency vehicles
  • Change lanes if possible
  • Watch for emergency workers

[IMAGE: emergencyvehicle]

3. Night Driving
- Use headlights from dusk to dawn
- High beam considerations:
  • Use when no oncoming traffic
  • Switch to low beams within 150m of approaching vehicle
  • Dim for vehicles you're following
- Additional precautions:
  • Reduce speed
  • Increase following distance
  • Watch for wildlife
  • Keep windshield clean

[IMAGE: nightdrive]`,
    duration: 15,
    videoUrl: "https://youtu.be/pzVDhGjMH9g?si=45SuS63prLP7JihL&t=103",
    quiz: [
      {
        question: "How far should you stop behind a school bus with flashing lights?",
        options: [
          "10 meters",
          "15 meters",
          "20 meters",
          "25 meters"
        ],
        correctAnswer: 2
      },
      {
        question: "When should you use your high beam headlights?",
        options: [
          "In heavy traffic",
          "When following another vehicle",
          "In foggy conditions",
          "When no oncoming traffic"
        ],
        correctAnswer: 3
      },
      {
        question: "What should you do when an emergency vehicle is stopped on the side of the road?",
        options: [
          "Continue at normal speed",
          "Slow down and move over if possible",
          "Stop completely",
          "Speed up to pass quickly"
        ],
        correctAnswer: 1
      },
      {
        question: "What is NOT a recommended night driving precaution?",
        options: [
          "Reducing speed",
          "Using high beams in all conditions",
          "Increasing following distance",
          "Watching for wildlife"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "module-6",
    title: "Impaired and Distracted Driving",
    content: `Understanding the serious consequences of impaired and distracted driving in Canada.

1. Alcohol and Drug Impairment
- Zero tolerance for novice and commercial drivers
- Blood Alcohol Concentration (BAC) limits:
  • 0.08% - Criminal offense
  • 0.05-0.079% - Provincial sanctions
  • Zero tolerance for new drivers
- Cannabis and driving:
  • Zero tolerance policy
  • Roadside testing
  • Severe penalties
- Consequences of impaired driving:
  • License suspension
  • Vehicle impoundment
  • Criminal record
  • Increased insurance rates

[IMAGE: impairement]

2. Distracted Driving Laws
- Prohibited activities while driving:
  • Using handheld devices
  • Texting or emailing
  • Programming GPS
  • Eating or drinking
- Exceptions for emergency calls
- Hands-free device rules:
  • Must be mounted
  • One-touch activation
  • Voice commands only
- Penalties:
  • Fines up to $3000
  • Demerit points
  • License suspension

[IMAGE: distracteddriving]

3. Fatigue Management
- Signs of driver fatigue:
  • Difficulty focusing
  • Heavy eyelids
  • Drifting between lanes
  • Missing exits
- Fatigue prevention strategies:
  • Get adequate sleep before driving
  • Take breaks every 2 hours
  • Share driving on long trips
  • Avoid driving at times you'd normally sleep
- When to stop:
  • When you catch yourself nodding off
  • When you can't remember the last few minutes
  • When you keep yawning or rubbing eyes
  • When your reactions feel slow

[IMAGE: fatigue]`,
    duration: 15,
    quiz: [
      {
        question: "What is the criminal offense BAC limit in Canada?",
        options: [
          "0.05%",
          "0.08%",
          "0.10%",
          "Any amount"
        ],
        correctAnswer: 1
      },
      {
        question: "Which activity is allowed while driving?",
        options: [
          "Using a mounted GPS with voice commands",
          "Texting at red lights",
          "Eating a meal",
          "Programming a GPS"
        ],
        correctAnswer: 0
      },
      {
        question: "What is the maximum fine for distracted driving?",
        options: [
          "$1000",
          "$2000",
          "$3000",
          "$5000"
        ],
        correctAnswer: 2
      },
      {
        question: "Which is NOT a sign of driver fatigue?",
        options: [
          "Heavy eyelids",
          "Singing along to radio",
          "Missing exits",
          "Drifting between lanes"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "module-7",
    title: "Licensing System & Insurance Requirements",
    content: `Understanding Ontario's graduated licensing system and insurance requirements.

1. Graduated Licensing System
- Three-stage process:
  • G1 License (Beginning):
    - Must be accompanied by fully licensed driver
    - Zero blood alcohol level
    - No driving on 400-series highways
  • G2 License (Intermediate):
    - Can drive independently
    - Zero blood alcohol level
    - Passenger restrictions at night
  • Full G License:
    - Full driving privileges
    - Regular blood alcohol limits apply
- Mandatory waiting periods between levels
- Required testing at each stage

[IMAGE: license]

2. Insurance Requirements
- Mandatory insurance coverage:
  • Third-party liability
  • Statutory accident benefits
  • Direct compensation
  • Uninsured automobile
- Minimum coverage amounts:
  • $200,000 liability insurance
  • Additional coverage options
- Factors affecting insurance rates:
  • Driving record
  • Vehicle type
  • Annual mileage
  • Location

[IMAGE: insurance]

3. License Maintenance
- Renewal requirements:
  • Vision tests
  • Fee payment
  • Address updates
- Demerit point system:
  • Points for traffic violations
  • Accumulation consequences
  • Point removal timeline
- Medical fitness requirements:
  • Regular testing for seniors
  • Medical condition reporting
  • Vision standards

[IMAGE: driving]`,
    duration: 15,
    quiz: [
      {
        question: "Which license is the first step in Ontario's graduated licensing system?",
        options: [
          "G1 License",
          "G2 License",
          "Full G License",
          "Learner's Permit"
        ],
        correctAnswer: 0
      },
      {
        question: "What is the minimum liability insurance required in Ontario?",
        options: [
          "$100,000",
          "$200,000",
          "$500,000",
          "$1,000,000"
        ],
        correctAnswer: 1
      },
      {
        question: "Which restriction applies to G1 drivers?",
        options: [
          "Must drive with a passenger",
          "Cannot drive at night",
          "Cannot drive on 400-series highways",
          "Must own a car"
        ],
        correctAnswer: 2
      },
      {
        question: "What is NOT a mandatory type of auto insurance coverage in Ontario?",
        options: [
          "Third-party liability",
          "Collision coverage",
          "Direct compensation",
          "Uninsured automobile"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "module-8",
    title: "Sharing the Road",
    content: `Learn how to safely share the road with various types of road users.

1. Interacting with Cyclists
- Minimum passing distance:
  • 1 meter on regular roads
  • More space at higher speeds
- Watch for cyclists when:
  • Making right turns
  • Opening car doors
  • Entering/exiting parking
- Yield to cyclists in bike lanes
- Special considerations:
  • Check blind spots carefully
  • Reduce speed when passing
  • Watch for hand signals

[IMAGE: cyclist]

2. Pedestrian Safety
- Pedestrian right of way:
  • At crosswalks
  • At school crossings
  • At controlled intersections
- Special attention areas:
  • School zones
  • Residential areas
  • Shopping districts
- Reduced visibility conditions:
  • Dawn and dusk
  • Bad weather
  • Night time

[IMAGE: pedestrian]

3. Public Transit and Large Vehicles
- Buses and streetcars:
  • Stop when doors open
  • Yield when merging
  • Watch for passengers
- Large trucks:
  • Avoid blind spots
  • Allow extra space
  • Never cut off
- Emergency vehicles:
  • Pull over and stop
  • Clear intersections
  • Follow from safe distance

[IMAGE: publictransportation]`,
    duration: 15,
    quiz: [
      {
        question: "What is the minimum safe passing distance for cyclists?",
        options: [
          "0.5 meters",
          "1 meter",
          "1.5 meters",
          "2 meters"
        ],
        correctAnswer: 1
      },
      {
        question: "When must you stop for a streetcar?",
        options: [
          "Never",
          "Only at stops",
          "When doors are open",
          "When signaled"
        ],
        correctAnswer: 2
      },
      {
        question: "Where should you be extra cautious for pedestrians?",
        options: [
          "Only at crosswalks",
          "Only in school zones",
          "Only at night",
          "All of the above"
        ],
        correctAnswer: 3
      },
      {
        question: "What should you do when approaching a truck's blind spot?",
        options: [
          "Speed up to pass quickly",
          "Honk your horn",
          "Stay out of it",
          "Follow closely"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "module-9",
    title: "Advanced Road Rules",
    content: `Master advanced road rules and regulations for safer driving.

1. Special Traffic Laws
- Move Over Law:
  • Change lanes for emergency vehicles
  • Slow down if lane change impossible
  • Minimum speed reduction required
- HOV (High-Occupancy Vehicle) Lanes:
  • Minimum occupancy requirements
  • Entry/exit points
  • Time restrictions
  • Permitted vehicles

[IMAGE: moveover]

2. Complex Intersections
- Roundabouts:
  • Yield to vehicles inside
  • Signal when exiting
  • Choose correct lane
  • Watch for pedestrians
- Advanced turn signals:
  • Protected left turns
  • Advance green arrows
  • Flashing signals
- Multiple turn lanes:
  • Stay in marked lanes
  • Follow proper paths
  • Watch for other vehicles

[IMAGE: roundabout]

3. Special Zones
- Construction zones:
  • Reduced speeds
  • Follow signage
  • Watch for workers
  • Lane changes
- Community safety zones:
  • Increased fines
  • Speed restrictions
  • Extra caution required
- Toll roads and express lanes:
  • Payment methods
  • Access points
  • Special rules

[IMAGE: schoolzones]`,
    duration: 15,
    quiz: [
      {
        question: "What is required in HOV lanes during peak hours?",
        options: [
          "One person",
          "Two or more people",
          "Three or more people",
          "Four or more people"
        ],
        correctAnswer: 1
      },
      {
        question: "What should you do when entering a roundabout?",
        options: [
          "Stop completely",
          "Yield to vehicles inside",
          "Take right of way",
          "Speed up"
        ],
        correctAnswer: 1
      },
      {
        question: "In a construction zone, you must:",
        options: [
          "Always stop",
          "Maintain normal speed",
          "Follow posted signs",
          "Use hazard lights"
        ],
        correctAnswer: 2
      },
      {
        question: "What happens to fines in community safety zones?",
        options: [
          "They stay the same",
          "They are reduced",
          "They are increased",
          "They are eliminated"
        ],
        correctAnswer: 2
      }
    ]
  }
];
