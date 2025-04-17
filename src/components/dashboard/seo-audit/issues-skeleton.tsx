import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const cellDividerClass = "border-l border-border/50 first:border-l-0";

export function IssuesSkeleton() {
  return (
    <Card className="shadow-sm border-border/40">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[400px]">Issue</TableHead>
                <TableHead className={cn("w-[120px]", cellDividerClass)}>
                  Severity
                </TableHead>
                <TableHead className={cn("w-[150px]", cellDividerClass)}>
                  Pages Affected
                </TableHead>
                <TableHead className={cn("w-[120px]", cellDividerClass)}>
                  Impact
                </TableHead>
                <TableHead className={cn("w-[100px]", cellDividerClass)}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="h-14">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 