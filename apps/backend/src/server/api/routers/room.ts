import { Injectable } from "@nestjs/common";
import { z } from "zod";



import { publicProcedure, router } from "../trpc";

import { RoomService } from "@/core/roomService";
import { genId } from "@/util/id";


@Injectable()
export class RoomRouter{
  constructor(
    private readonly roomService: RoomService,
  ) {}

  public getRoomRouter() {
    return router({
      create: publicProcedure
        .input(
          z.object({
            password: z.string(),
          }),
        )
        .mutation(async (opts) => {
          const id = genId();
          return await this.roomService.createRoom({
            id,
            password: opts.input.password,
          });
        }),
      join: publicProcedure
        .input(
          z.object({
            name: z.string(),
            password: z.string(),
          }),
        )
        .mutation(async (opts) => {
          const id = genId();
          return await this.roomService.joinRoom(
            {
              id,
              name: opts.input.name,
            },
            {
              password: opts.input.password,
            },
          );
        }),
    });
  }
}

