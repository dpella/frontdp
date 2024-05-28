/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { createContext, useContext, useState} from 'react';
import { User, UserContextType, UserProviderProps } from '../types/interfaces';

/**
 * Creates a React context for user data, initially set to undefined.
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * A provider component that sets up the user context which can be consumed throughout the application.
 * This component allows consuming components to access and manipulate the user state.
 *
 * @param {UserProviderProps} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the context.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to consume the user context. It ensures the context is used within a UserProvider.
 * Throws an error if the context is accessed outside of a UserProvider to prevent misuse.
 *
 * @returns {UserContextType} The user context containing the user state and function to set the user state.
 * @throws {Error} Throws an error if the hook is used outside of a UserProvider.
 */
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('error');
    }
    return context;
  };
