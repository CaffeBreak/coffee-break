import { z } from "zod";

const IdSchema = z.string().brand("cardId");

const RoleSchema = z.union([z.literal("COMMON"), z.literal("VILLAGER"), z.literal("WEREWOLF")]);

const cardSinceSchema = z.number();
const cardUntilSchema = z.number();

type Id = z.infer<typeof IdSchema>;
type Role = z.infer<typeof RoleSchema>;
type Since = z.infer<typeof cardSinceSchema>;
type Until = z.infer<typeof cardUntilSchema>;

export abstract class Card {
  public readonly cardId: Id;
  public readonly cardName: string;
  public readonly role: Role;
  public readonly since: Since;
  public readonly until: Until;

  constructor(cardId: string, cardName: string, role: Role, since: Since, until: Until) {
    this.cardId = IdSchema.parse(cardId);
    this.cardName = cardName;
    this.role = role;
    this.since = since;
    this.until = until;
  }
}
