export const ALL_SPORTS = ['Football', 'Cricket'] as const;
export const ALL_LEAGUES = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'] as const;

export type Sport = (typeof ALL_SPORTS)[number];
export type League = (typeof ALL_LEAGUES)[number];

export type PerformanceMetric = {
  metric: string;
  value: number;
  unit: string;
};

// This represents the data structure for a player
export type PlayerDocument = {
  name: string;
  avatar: string;
  sport: Sport;
  age: number;
  location: string;
  mobile: string;
  height: number;
  weight: number;
  gender: 'Male' | 'Female';
  dreamClub: string;
  skills: string[];
  verified: boolean;
  achievementsText: string;
  achievementsImage: string;
  creatorEmail: string; 
  performanceData?: PerformanceMetric[];
  createdAt: any;
};

// This represents the player object used in the app (with ID)
export type Player = PlayerDocument & {
    id: string;
};

// This represents the data structure for a club
export type ClubDocument = {
    name: string;
    logo: string;
    league: League;
    location: string;
    address: string;
    foundationDate: string;
    description: string;
    verified: boolean;
    scoutingFocus: string[];
    creatorEmail: string;
    contactPerson: string;
    contactMobile: string;
    contactEmail: string;
    createdAt: any;
};

// This represents the club object used in the app (with ID)
export type Club = ClubDocument & {
    id: string;
};


// Mock data is used for local development.
export const players: Player[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://picsum.photos/seed/p1/200/200',
        sport: 'Football',
        age: 22,
        location: 'London, UK',
        mobile: '+44 1234567890',
        height: 185,
        weight: 80,
        gender: 'Male',
        dreamClub: 'Arsenal',
        skills: ['Dribbling', 'Passing', 'Shooting'],
        verified: true,
        achievementsText: 'Won the local league championship with 15 goals in the season. Named "Young Player of the Year".',
        achievementsImage: 'https://picsum.photos/seed/a1/600/400',
        creatorEmail: 'demo@example.com',
        performanceData: [
            { metric: 'Sprint Speed', value: 33, unit: 'km/h' },
            { metric: 'Shot Accuracy', value: 85, unit: '%' },
        ],
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Priya Sharma',
        avatar: 'https://picsum.photos/seed/p2/200/200',
        sport: 'Cricket',
        age: 20,
        location: 'Mumbai, India',
        mobile: '+91 9876543210',
        height: 165,
        weight: 58,
        gender: 'Female',
        dreamClub: 'Mumbai Indians',
        skills: ['Batting', 'Spin Bowling'],
        verified: false,
        achievementsText: 'Scored a century in the regional U-21 tournament. Known for aggressive batting style.',
        achievementsImage: 'https://picsum.photos/seed/a2/600/400',
        creatorEmail: 'demo@example.com',
        performanceData: [
            { metric: 'Batting Average', value: 45.5, unit: '' },
            { metric: 'Bowling Economy', value: 4.2, unit: 'rpo' },
        ],
        createdAt: new Date().toISOString(),
    }
];

export const clubs: Club[] = [
    {
        id: 'club-1',
        name: 'FC Barcelona',
        logo: 'https://picsum.photos/seed/c1/200/200',
        league: 'La Liga',
        location: 'Barcelona, Spain',
        address: 'C. d\'Arístides Maillol, 12, 08028 Barcelona, Spain',
        foundationDate: '1899-11-29',
        description: 'A professional football club based in Barcelona, Catalonia, Spain. Known for its historical success and tiki-taka style of play.',
        verified: true,
        scoutingFocus: ['Midfielder', 'Forward', 'Youth Talent'],
        creatorEmail: 'recruiter@fcb.com',
        contactPerson: 'Joan Laporta',
        contactMobile: '+34 902 1899 00',
        contactEmail: 'contact@fcbarcelona.cat',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'club-2',
        name: 'Manchester United',
        logo: 'https://picsum.photos/seed/c2/200/200',
        league: 'Premier League',
        location: 'Manchester, England',
        address: 'Sir Matt Busby Way, Old Trafford, Stretford, Manchester M16 0RA, UK',
        foundationDate: '1878-03-05',
        description: 'One of the most widely supported football clubs in the world. They have won more trophies than any other club in English football.',
        verified: true,
        scoutingFocus: ['Defender', 'Goalkeeper'],
        creatorEmail: 'scout@manutd.co.uk',
        contactPerson: 'Sir Jim Ratcliffe',
        contactMobile: '+44 161 676 7770',
        contactEmail: 'enquiries@manutd.co.uk',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'club-3',
        name: 'Juventus F.C.',
        logo: 'https://picsum.photos/seed/c3/200/200',
        league: 'Serie A',
        location: 'Turin, Italy',
        address: 'Via Druento, 175, 10151 Torino TO, Italy',
        foundationDate: '1897-11-01',
        description: 'An Italian professional football club based in Turin, Piedmont. Nicknamed the "Old Lady".',
        verified: false,
        scoutingFocus: ['Striker', 'Winger'],
        creatorEmail: 'recruiter@juventus.it',
        contactPerson: 'Cristiano Giuntoli',
        contactMobile: '+39 011 65 631',
        contactEmail: 'info@juventus.com',
        createdAt: new Date().toISOString(),
    }
];
