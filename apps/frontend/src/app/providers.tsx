"use client";

import { NextUIProvider } from "@nextui-org/react";
import React from "react";

// eslint-disable-next-line react/destructuring-assignment
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};
