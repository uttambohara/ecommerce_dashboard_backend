import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <div className="relative h-14 w-full">
      <Image
        src={"/logo.svg"}
        alt={"Company logo"}
        fill
        priority
        className="object-fit"
      />
    </div>
  );
}
