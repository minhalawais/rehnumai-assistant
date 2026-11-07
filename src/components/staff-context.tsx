"use client";

import { createContext, useContext } from "react";

type StaffAccess = { canCreate: boolean; canReview: boolean; canWriteRestricted: boolean };
const StaffContext = createContext<StaffAccess>({ canCreate: false, canReview: false, canWriteRestricted: false });
export function StaffProvider({ children, access }: { children: React.ReactNode; access: StaffAccess }) { return <StaffContext.Provider value={access}>{children}</StaffContext.Provider>; }
export function useStaffAccess() { return useContext(StaffContext); }
