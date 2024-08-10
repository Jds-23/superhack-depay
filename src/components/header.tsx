'use client';

import React from "react";
import Image from "next/image";
import Logo from "../assets/logo.svg";
// import { useWalletContext } from "@/context/WalletContext";
import Link from "next/link";
import { Button } from "./ui/button";
// import { useMerchant } from "@/hooks/useMerchant";
// import { getAddressTrimmed } from "@/utils/getAddressTrimmed";

const Header = () => {
    // const { currentAccount, openWalletModal } = useWalletContext();
    // const { data: merchant } = useMerchant(currentAccount?.address);

    return (
        <div className="h-24 pt-3 px-3 md:px-32 fixed top-0 left-0 w-full">
            <div className="h-16 p-3 flex justify-between items-center rounded-xl border-2 border-bg5 bg-[#d1eaff]  md:border-2">
                <Link href="/">
                    <Image src={Logo} alt="img" />
                </Link>
                {/* <button
                    onClick={openWalletModal}
                    className="rounded-xl p-3  text-text1 text-sm bg-gradient-to-b from-bg4 to-bg5"
                >
                    {currentAccount ?
                        merchant ? (
                            merchant.merchantName
                        ) :
                            (getAddressTrimmed(currentAccount.address))
                        : (
                            "Connect Wallet"
                        )}
                </button> */}
                <Button>
                    Connect Wallet
                </Button>
            </div>
        </div>
    );
};

export default Header;
