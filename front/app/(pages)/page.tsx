"use client";

import { Button } from "@/components/ui/button";
import { NextPage } from "next";

import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="w-[100vw] h-[90vh] flex justify-center items-center gap-4">
      <Button
        onClick={() => {
          router.push("/lend");
        }}
      >
        Lend Now
      </Button>
      <Button
        onClick={() => {
          router.push("/borrow");
        }}
      >
        Borrow Now
      </Button>
    </div>
  );
};

export default Home;
