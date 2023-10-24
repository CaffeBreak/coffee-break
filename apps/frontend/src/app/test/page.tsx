import { trpc } from "@/utils/trpc";
const IndexPage = () => {
  const hello = trpc.player.create.useMutation({
    name: "aaaa",
  });
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data}</p>
    </div>
  );
};
export default IndexPage;
