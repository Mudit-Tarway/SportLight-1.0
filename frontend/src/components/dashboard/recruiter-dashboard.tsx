'use client';

import { useState, useMemo } from 'react';
import type { Club } from '@/lib/mock-data';
import { ClubCard } from './club-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useClubs } from '@/hooks/use-clubs';
import { ALL_LEAGUES } from '@/lib/mock-data';
import { ClubProfileModal } from './club-profile-modal';

export function RecruiterDashboard() {
  const { clubs } = useClubs();
  const [searchTerm, setSearchTerm] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLeague = leagueFilter === 'all' || club.league === leagueFilter;
      return matchesSearch && matchesLeague;
    });
  }, [clubs, searchTerm, leagueFilter]);

  const leagues = useMemo(() => ['all', ...ALL_LEAGUES], []);

  const handleViewProfile = (club: Club) => {
    setSelectedClub(club);
  };

  const handleCloseModal = () => {
    setSelectedClub(null);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by club name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={leagueFilter} onValueChange={setLeagueFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Leagues" />
          </SelectTrigger>
          <SelectContent>
            {leagues.map(league => (
              <SelectItem key={league} value={league}>
                {league === 'all' ? 'All Leagues' : league}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} onViewProfile={handleViewProfile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="font-headline text-2xl">No Clubs Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
      <ClubProfileModal 
        club={selectedClub}
        open={!!selectedClub}
        onOpenChange={(open) => !open && handleCloseModal()}
      />
    </div>
  );
}
