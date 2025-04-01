
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{backgroundImage:"url('/sweetBalance/bg.jpg')"}}>
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Sweet Balance Chat
        </h1>
         <ChatWindow/>
      </div>

    </main>
  );
}
