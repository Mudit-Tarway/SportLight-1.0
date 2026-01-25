"use client";

import { createContext, useContext, ReactNode, useState, useMemo, useCallback } from "react";
import { Player, PlayerDocument, players as mockPlayers } from "@/lib/mock-data";

type PlayersContextType = {
  players: Player[];
  loading: boolean;
  addPlayer: (player: Omit<PlayerDocument, 'creatorEmail' | 'createdAt'>) => Promise<string>;
  deletePlayer: (playerId: string) => Promise<void>;
  updatePlayer: (playerId: string, playerData: Partial<PlayerDocument>) => Promise<void>;
};

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [loading, setLoading] = useState(false);

  const addPlayer = useCallback(async (playerData: Omit<PlayerDocument, 'creatorEmail' | 'createdAt'>): Promise<string> => {
    const newId = (Math.random() * 1000000).toFixed(0);
    const newPlayer: Player = {
        ...playerData,
        id: newId,
        creatorEmail: 'localuser@example.com', // Dummy email for local state
        createdAt: new Date().toISOString(),
    };
    setPlayers(prev => [newPlayer, ...prev]);
    return newId;
  }, []);
  
  const deletePlayer = useCallback(async (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);
  
  const updatePlayer = useCallback(async (playerId: string, playerData: Partial<PlayerDocument>) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, ...playerData } : p));
  }, []);

  const value = useMemo(() => ({
    players,
    loading,
    addPlayer,
    deletePlayer,
    updatePlayer,
  }), [players, loading, addPlayer, deletePlayer, updatePlayer]);

  return (
    <PlayersContext.Provider value={value}>
      {children}
    </PlayersContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
}
