import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-1/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full rounded" />
      </CardContent>
    </Card>
  );
}