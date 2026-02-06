import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-lg @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-gradient-to-br *:data-[slot=card]:from-white *:data-[slot=card]:to-gray-50 dark:*:data-[slot=card]:from-gray-900 dark:*:data-[slot=card]:to-gray-800 lg:px-6">
      <Card className="@container/card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="relative pb-3">
          <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Revenue
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            $45,250.00
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge className="flex gap-1 rounded-full bg-green-100 text-green-800 border-green-200 text-xs font-semibold">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-gray-900 dark:text-gray-100">
            Trending up this month{" "}
            <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            Revenue growth exceeds targets
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="relative pb-3">
          <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Transactions
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            1,234
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge className="flex gap-1 rounded-full bg-blue-100 text-blue-800 border-blue-200 text-xs font-semibold">
              <TrendingUpIcon className="size-3" />
              +8.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-gray-900 dark:text-gray-100">
            Strong activity growth{" "}
            <TrendingUpIcon className="size-4 text-blue-500" />
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            234 new this week
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="relative pb-3">
          <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Verified Users
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            45,678
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge className="flex gap-1 rounded-full bg-purple-100 text-purple-800 border-purple-200 text-xs font-semibold">
              <TrendingUpIcon className="size-3" />
              +15.3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-gray-900 dark:text-gray-100">
            Excellent retention{" "}
            <TrendingUpIcon className="size-4 text-purple-500" />
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            98% satisfaction rate
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="relative pb-3">
          <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Success Rate
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-bold tabular-nums bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            99.2%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge className="flex gap-1 rounded-full bg-orange-100 text-orange-800 border-orange-200 text-xs font-semibold">
              <TrendingUpIcon className="size-3" />
              +2.1%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-gray-900 dark:text-gray-100">
            Industry leading{" "}
            <TrendingUpIcon className="size-4 text-orange-500" />
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            Above benchmark performance
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
