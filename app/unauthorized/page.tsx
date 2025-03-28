import Image from "next/image";
import Link from "next/link";

export default function Example() {
  return (
    <>
      <div className="grid min-h-screen grid-cols-1 grid-rows-[1fr_auto_1fr] lg:grid-cols-[max(50%,36rem)_1fr]">
        <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/img/logo.png"
              width={80}
              height={80}
              alt="$Goblin"
              className="rounded-full"
            />
            <h1 className="text-xl font-bold text-white mt-2">Goblin</h1>
          </Link>
        </header>
        <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
          <div className="max-w-lg">
            <p className="text-base/8 font-semibold text-primary">403</p>
            <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Whoa there, adventurer 🧙‍♂️
            </h1>
            <p className="mt-6 text-pretty text-lg font-medium text-gray-400 sm:text-xl/8">
              You’ve stumbled into a secret goblin lair... but you don’t have
              the magic key 🪄. Only admins may enter beyond this point. Nice
              try though 😉
            </p>
            <div className="mt-10">
              <a
                href="/"
                className="text-sm/7 font-semibold text-primary hover:underline">
                <span aria-hidden="true">&larr;</span> Back to the safety of
                home
              </a>
            </div>
          </div>
        </main>

        <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
          <Image
          width={1300}
          height={1200}
            alt="401 cover"
            src="/img/401-cover.png"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
