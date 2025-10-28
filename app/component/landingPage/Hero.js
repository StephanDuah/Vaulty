import React from "react";
import Image from "next/image";
import Link from "next/link";
const Hero = () => {
  return (
    <section className="bg-primaryColor w-full min-h-[70vh]">
      <div className=" flex items-center min-h-[70vh] max-w-7xl mx-auto justify-between ">
        <div className="space-y-4">
          <h1 className="text-6xl text-white ">
            Start Your Secure <br />{" "}
            <span className="text-secondaryColor">Transaction Today! </span>
          </h1>
          <p className="text-white text-lg">
            Sign up now and experience worry-free transactions <br></br>with our
            trusted escrow service.
          </p>
          <div>
            <Link
              href={"/auth/register"}
              className="text-slate-700 bg-white px-4 py-2 mt-4 rounded-md "
            >
              Get Started
            </Link>
          </div>
        </div>

        <div>
          <Image
            src="/images/landingPage/pic.jpg"
            alt="man holding hand"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
