import Head from "next/head";
import { TentCalculator } from "~/components/calculator/tent-calculator";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tent Size Calculator</title>
        <meta name="description" content="Calculate dimensions for triangular prism tent under tarp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-background">
        <TentCalculator />
      </main>
    </>
  );
}
