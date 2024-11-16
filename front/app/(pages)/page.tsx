"use client";

import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import Image from "next/image";
import logo from "@/assets/logo.png";

import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="w-[100vw] h-[90vh] flex flex-col justify-center items-center gap-4">
      <Image
        src={logo}
        alt="Logo"
        width={400}
        height={400}
        className="-mt-32"
      />
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => {
            router.push("/lend");
          }}
          className="w-[120px]"
        >
          Lend Now
        </Button>
        <Button
          onClick={() => {
            router.push("/borrow");
          }}
          className="w-[120px]"
          variant="secondary"
        >
          Borrow Now
        </Button>
      </div>
    </div>
  );
};

export default Home;
