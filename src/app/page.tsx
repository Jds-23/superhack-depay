'use client';
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <div className="fixed rounded-xl sm:rounded-3xl  z-[-1] w-[98vw] h-[98vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 bg-gradient-to-b from-[#EFF8FF] to-[#D1EAFF]">
      </div>
      <div className="px-3 pt-14 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-primary mt-10 transition-all">Cross-asset Decentralized</h1>
        <h2 className="text-3xl sm:text-6xl  font-semibold transition-all">Payment Gateway</h2>
        <sub className="text-xs sm:text-lg mt-4 transition-all">Designed to facilitate seamless and secure cryptocurrency transactions.</sub>
        <div className="mt-10">
          <Button onClick={e => {
            e.preventDefault();
            window.location.href = "/m";
          }} >Register As Merchant</Button>
        </div>
        {/* <div className="fixed left-1/2 -translate-x-1/2 -bottom-11 z-auto px-2">
        <img className="w-full m-w-56 cursor-pointer object-contain hover:animate-wiggle" src={"/images/depay.png"} alt="img" />
      </div> */}

      </div>
    </>
  );
}
