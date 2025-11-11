"use client";

import { createContext } from "react";
import { LocalizationContextValue } from "./LocalizationProvider";

export const LocalizationContext = createContext<
  LocalizationContextValue | undefined
>(undefined);
