import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="relative mt-6 mb-6 flex items-center justify-center w-full h-12 sm:h-16">
      <div className="flex justify-between items-center w-full px-4 h-full">
        <div className="flex items-center text-xl h-full space-x-4">
          <Link href="/">
            <span className="cursor-pointer transition duration-300 transform font-semibold pr-4 flex items-center h-full">
              ANIME
            </span>
          </Link>
          <Link href="/manga">
            <span className="cursor-pointer transition duration-300 transform font-semibold pr-4 flex items-center h-full">
              MANGA
            </span>
          </Link>
        </div>

        <Link href="/">
          <div className="cursor-pointer transition duration-300 transform font-semibold relative">
            <Image
              src="/gallery/kzz1.png"
              alt="Kaizen Logo"
              width={100}
              height={20}
              objectFit="cover"
              objectPosition="50% 50%"
              className="hover:opacity-80 transition duration-300"
            />
          </div>
        </Link>
      </div>
    </nav>
  );
}
