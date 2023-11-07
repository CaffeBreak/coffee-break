import { trpc } from "../utils/trpc";

export default function Home() {
  const player = trpc.player.create.useMutation();
  if (!player.data) {
    console.log(player.data);
    // return <div>Loading...</div>;
  }

  player.mutate({
    name: "aaaa",
  });

  return <main>{}</main>;
}
