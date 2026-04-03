import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  onCreateClick: () => void
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 text-muted-foreground">
        No workspaces yet
      </div>

      <Button size="lg" onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Create your first workspace
      </Button>
    </div>
  );
}
