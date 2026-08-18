'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type NavContextType = {
  forceBackground?: boolean;
};

const NavContext = createContext<NavContextType>({});

export function NavProvider({ children, forceBackground }: { children: ReactNode; forceBackground?: boolean }) {
  return (
    <NavContext.Provider value={{ forceBackground }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNavContext() {
  return useContext(NavContext);
}
