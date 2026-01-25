
'use client';

import { useState, useMemo } from 'react';
import type { Player } from '@/lib/mock-data';
import { PlayerCard } from './player-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { PlayerProfileModal } from './player-profile-modal';
import { ALL_SPORTS } from '@/lib/mock-data';


interface PlayerDashboardProps {
  players: Player[];
}

export function PlayerDashboard({ players }: PlayerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            player.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSport = sportFilter === 'all' || player.sport === sportFilter;
      return matchesSearch && matchesSport;
    });
  }, [players, searchTerm, sportFilter]);

  const sports = useMemo(() => ['all', ...ALL_SPORTS], []);

  const handleViewProfile = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or skill..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sports" />
          </SelectTrigger>
          <SelectContent>
            {sports.map(sport => (
              <SelectItem key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} onViewProfile={handleViewProfile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="font-headline text-2xl">No Players Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
      <PlayerProfileModal 
        player={selectedPlayer}
        open={!!selectedPlayer}
        onOpenChange={(open) => !open && handleCloseModal()}
      />
    </div>
  );
}
