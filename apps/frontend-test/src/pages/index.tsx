import { trpc } from "../utils/trpc";

export default function Home() {
  const player = trpc.player.create.useMutation();
  player.mutate({
    name: "aaaa",
  });

  if (!player.data) {
    console.log(player.data);
    return <div>Loading...</div>;
  }

  return <main>{}</main>;
}
