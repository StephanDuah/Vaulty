import React from "react";
import Wrapper from "./dashboard-card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { auth } from "@/auth";
import { getProfile } from "@/lib/logic/user";
import { getTransactionWithdeadline } from "@/lib/logic/transactions";
import { displayCurrency } from "@/lib/utils";

const getProfileData = async () => {
  const session = await auth();
  if (!session) return <div>I have got nothing</div>;
  const id = session?.user?.id;
  const {
    TotalTransactions,
    PendingTransactions,
    SuccessfullTransactions,
    FailedTransactions,
    EscrowScore,
    TotalAmount,
  } = await getProfile(id);

  return {
    profile: [
      { name: "Total Transactions", value: TotalTransactions },
      { name: "Successful Transactions", value: SuccessfullTransactions },
      { name: "Failed Transactions", value: FailedTransactions },
      { name: "Pending Transactions", value: PendingTransactions },
    ],
    EscrowScore,
    TotalAmount,
  };
};

const ProfileCard = async () => {
  const profileData = await getProfileData();

  return (
    <Wrapper>
      <article className="bg-white max-w-3xl mx-auto rounded-xl border border-zinc-100 flex flex-col  p-4 dark:bg-zinc-900 dark:text-white dark:border-zinc-700">
        <div className="flex items-center justify-between  border-b border-zinc-100 p-2 dark:border-zinc-700">
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Total money earned
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-200">
              {displayCurrency(profileData.TotalAmount)}
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {/* <Avatar className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-600">
              <AvatarImage
                className="rounded-full"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            <p className="text-xs text-zinc-600">User Name</p>
          </div>
        </div>
        <div className="flex-col gap-2">
          {profileData.profile.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border-b border-zinc-100 dark:border-zinc-600"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.name}
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="flex  justify-between items-center p-2">
          <h4 className="text-sm text-zinc-500 dark:text-zinc-400">
            Escrow Score
          </h4>
          <p className="text-lg text-zinc-900 dark:text-zinc-200 font-semibold">
            {profileData.EscrowScore}
          </p>
        </div>
      </article>
    </Wrapper>
  );
};

export default ProfileCard;
