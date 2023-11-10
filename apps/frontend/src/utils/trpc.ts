"use client";

import { createTRPCReact } from "@trpc/react-query";

import type { Router } from "backend/src/api/trpc";

export const trpc = createTRPCReact<Router>();
