import dynamic from "next/dynamic";
import Anime from "./components/animeslider";
import Anidisplay from "./components/anidisplay";
export default function Home() {
  return (
    <main>
      <Anime /> <Anidisplay />
    </main>
  );
}
