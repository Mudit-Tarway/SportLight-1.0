
"use client";

import { createContext, useContext, ReactNode, useState, useMemo, useCallback } from "react";
import { Club, ClubDocument, clubs as mockClubs, League } from "@/lib/mock-data";

type ClubsContextType = {
  clubs: Club[];
  loading: boolean;
  addClub: (clubData: { name: string; league: League; location: string; description: string; scoutingFocus: string[]; creatorEmail: string;}) => Promise<string>;
  updateClub: (clubId: string, clubData: Partial<ClubDocument>) => Promise<void>;
};

const ClubsContext = createContext<ClubsContextType | undefined>(undefined);

export function ClubsProvider({ children }: { children: ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [loading, setLoading] = useState(false);

  const addClub = useCallback(async (clubData: { name: string; league: League; location: string; description: string; scoutingFocus: string[]; creatorEmail: string;}) => {
    const newId = `club-${Date.now()}`;
    const newClub: Club = {
      id: newId,
      name: clubData.name,
      league: clubData.league,
      location: clubData.location,
      description: clubData.description,
      scoutingFocus: clubData.scoutingFocus,
      creatorEmail: clubData.creatorEmail,
      logo: `https://picsum.photos/seed/${newId}/200/200`,
      verified: false,
      createdAt: new Date().toISOString(),
      address: clubData.location,
      foundationDate: new Date().toISOString().split('T')[0],
      contactPerson: 'N/A',
      contactMobile: 'N/A',
      contactEmail: clubData.creatorEmail,
    };
    setClubs(prev => [newClub, ...prev]);
    return newId;
  }, []);

  const updateClub = useCallback(async (clubId: string, clubData: Partial<ClubDocument>) => {
    setClubs(prev => prev.map(c => c.id === clubId ? { ...c, ...clubData } : c));
  }, []);

  const value = useMemo(() => ({
    clubs,
    loading,
    addClub,
    updateClub,
  }), [clubs, loading, addClub, updateClub]);

  return (
    <ClubsContext.Provider value={value}>
      {children}
    </ClubsContext.Provider>
  );
}

export function useClubs() {
  const context = useContext(ClubsContext);
  if (context === undefined) {
    throw new Error("useClubs must be used within a ClubsProvider");
  }
  return context;
}
