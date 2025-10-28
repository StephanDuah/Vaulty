import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CheckoutSkeleton = () => {
  return (
    <main className="bg-gray-200 min-h-screen">
      <h1 className="text-2xl">
        <Skeleton className="w-40 h-8" />
      </h1>
      <section className="w-full max-w-[1440px] mx-auto py-10 grid grid-cols-3 gap-4">
        <div className="grid col-span-2 gap-4">
          <DynamicFormSkeleton />
          <BuyerFormSkeleton />
        </div>
        <div className="grid col-span-1 gap-4">
          <ProfileDisplaySkeleton />
          <OrderSummarySkeleton />
        </div>
      </section>
    </main>
  );
};

const DynamicFormSkeleton = () => {
  return (
    <Card className="space-y-6 p-6">
      <CardTitle>
        <Skeleton className="w-40 h-6" />
      </CardTitle>
      {[1, 2].map((index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          {[1, 2, 3].map((fieldIndex) => (
            <div key={fieldIndex}>
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>
          ))}
          <Skeleton className="w-full h-10" />
        </div>
      ))}
      <Skeleton className="w-full h-10" />
    </Card>
  );
};

const BuyerFormSkeleton = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-48 h-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-10" />
            </div>
          ))}
        </div>
        {[1, 2, 3].map((index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-10" />
          </div>
        ))}
        <Skeleton className="w-full h-10" />
      </CardContent>
    </Card>
  );
};

const ProfileDisplaySkeleton = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="text-center sm:text-left space-y-2">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-48 h-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-1">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-32 h-4" />
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <Skeleton className="w-24 h-5 mb-2" />
          <Skeleton className="w-full h-20" />
        </div>
      </CardContent>
    </Card>
  );
};

const OrderSummarySkeleton = () => {
  return (
    <Card className="p-6">
      <CardTitle>
        <Skeleton className="w-40 h-6 mb-4" />
      </CardTitle>
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex justify-between items-center mb-3">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-8 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      ))}
      <Skeleton className="w-full h-px my-4" />
      <Skeleton className="w-32 h-6 mb-4" />
      <Skeleton className="w-full h-10" />
    </Card>
  );
};

export default CheckoutSkeleton;
