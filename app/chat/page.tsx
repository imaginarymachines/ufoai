import ChatScreen from "@/components/ChatScreen";

export default function Chat() {

  //Nesting a client component so I can use state
  //Layout should be higher up the tree
  return (
    <>
      <ChatScreen />
    </>
  );
}
