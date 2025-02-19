export interface Module {
  id: string;
  title: string;
  content: string;
  duration: number; // in minutes
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

2. Right-Hand Driving
- In Canada, vehicles drive on the right side of the road
- Pass other vehicles on the left
- Keep right except when passing

3. Speed Limits
- Posted in kilometers per hour (km/h)
- Common limits:
  • School zones: 30-40 km/h
  • Residential areas: 40-50 km/h
  • Major roads: 60-70 km/h
  • Highways: 100-110 km/h`,
    duration: 7,
    quiz: [
      {
        question: "What does a red octagonal sign mean?",
        options: ["Yield", "Stop", "Slow down", "Merge"],
        correctAnswer: 1
      },
      {
        question: "On which side of the road do you drive in Canada?",
        options: ["Left side", "Right side", "Either side", "Center"],
        correctAnswer: 1
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

2. Parking Rules
- No parking within 5 meters of fire hydrants
- No parking in front of driveways
- Pay attention to parking signs and meters
- Winter parking restrictions may apply

3. Safe Following Distance
- Maintain 2-3 seconds following distance in good conditions
- Increase distance in poor weather
- Use the "two-second rule": pick a fixed point and count
- Double distance at night or in bad weather`,
    duration: 7,
    quiz: [
      {
        question: "What is the minimum safe following distance in good conditions?",
        options: ["1 second", "2-3 seconds", "5 seconds", "10 seconds"],
        correctAnswer: 1
      },
      {
        question: "Who has the right of way at a 4-way stop?",
        options: [
          "The vehicle on the right",
          "The largest vehicle",
          "The first vehicle to stop",
          "Emergency vehicles only"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "module-3",
    title: "Safety and Emergency Procedures",
    content: `Learn essential safety procedures and emergency responses for Canadian roads.

1. Winter Driving
- Install winter tires when temperature drops below 7°C
- Keep emergency kit in vehicle
- Clear all snow and ice from vehicle before driving
- Increase following distance on slippery roads

2. Emergency Procedures
- If your vehicle breaks down:
  • Pull over to the shoulder
  • Turn on hazard lights
  • Stay in your vehicle if safe
  • Call for assistance
- In case of accidents:
  • Ensure safety first
  • Call emergency services if needed
  • Exchange information with other drivers
  • Document the scene

3. Impaired Driving
- Zero tolerance for alcohol or drugs while driving
- Severe penalties including:
  • License suspension
  • Fines
  • Possible jail time
- Plan ahead for safe transportation`,
    duration: 6,
    quiz: [
      {
        question: "What should you do if your car breaks down?",
        options: [
          "Leave it immediately",
          "Pull over and turn on hazard lights",
          "Speed up to reach destination",
          "Call family only"
        ],
        correctAnswer: 1
      },
      {
        question: "When should you install winter tires?",
        options: [
          "Only when it snows",
          "When temperature drops below 7°C",
          "In December only",
          "Never needed"
        ],
        correctAnswer: 1
      }
    ]
  }
];