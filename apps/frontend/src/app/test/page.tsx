import { trpc } from "@/utils/trpc";
const IndexPage = () => {
  const player = trpc.player.create.useMutation();
  if (!player.data) {
    return <div>Loading...</div>;
  }
  player.mutate({
    name: "aaaa",
  });
  console.log(player.data);
  return (
    <div>
      <p>{}</p>
    </div>
  );
};
export default IndexPage;
