import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-primaryColor fixed w-100 top-0 left-0 right-0 ">
      <nav className="flex items-center justify-between py-5 mx-auto max-w-7xl text-white ">
        <div className="">Logo</div>
        <ul className="flex flex-col items-center justify-center md:flex-row space-x-10">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/service">Service</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
