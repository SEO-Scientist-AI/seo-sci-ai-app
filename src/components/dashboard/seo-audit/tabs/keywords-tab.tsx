"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Keyword {
  id: string;
  keyword: string;
  position: number;
  change: number;
  volume: number;
  difficulty: "easy" | "medium" | "hard";
  intent: "informational" | "transactional" | "navigational";
}

interface KeywordsTabProps {
  keywords: Keyword[];
}

export function KeywordsTab({ keywords }: KeywordsTabProps) {
  const getDifficultyColor = (difficulty: Keyword["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
    }
  };

  const getIntentColor = (intent: Keyword["intent"]) => {
    switch (intent) {
      case "informational":
        return "bg-blue-500";
      case "transactional":
        return "bg-purple-500";
      case "navigational":
        return "bg-gray-500";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Intent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword) => (
            <TableRow key={keyword.id}>
              <TableCell className="font-medium">{keyword.keyword}</TableCell>
              <TableCell>{keyword.position}</TableCell>
              <TableCell>
                <span
                  className={
                    keyword.change > 0
                      ? "text-green-500"
                      : keyword.change < 0
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {keyword.change > 0 ? "+" : ""}
                  {keyword.change}
                </span>
              </TableCell>
              <TableCell>{keyword.volume.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(keyword.difficulty)}>
                  {keyword.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getIntentColor(keyword.intent)}>
                  {keyword.intent}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 