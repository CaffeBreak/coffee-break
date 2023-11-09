import { trpc } from "../utils/trpc";

export default function Home() {
  const player = trpc.player.create.useMutation();

  const handler = () => {
    player.mutate({
      name: "aaaa",
    });

    console.log(player.data);
  };

  return <button onClick={handler}>押してね</button>;
}
