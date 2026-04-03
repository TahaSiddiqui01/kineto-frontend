import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";

interface WorkspaceCardProps {
  name: string;
  slug: string;
  industry: string;
  logoUrl?: string;
  plan: string;
  role: string;
}

export const WorkspaceCard = ({
  name,
  slug,
  industry,
  logoUrl,
  plan,
  role,
}: WorkspaceCardProps) => {
  return (
    <Link href={`/dashboard/${slug}`} className="group block">
      <div className="relative rounded-xl border bg-background p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 min-w-62.5">
        
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <Avatar className="h-11 w-11 border">
            <AvatarImage src={logoUrl} alt={name} />
            <AvatarFallback className="bg-muted">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          <Badge
            variant="secondary"
            className="capitalize text-[10px] px-2 py-0.5"
          >
            {plan}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight group-hover:underline">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {industry}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-5">
          <Badge
            variant="outline"
            className="capitalize text-xs font-normal"
          >
            {role}
          </Badge>

          <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-all">
            <span className="text-xs opacity-0 group-hover:opacity-100 transition">
              Open
            </span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Subtle Hover Glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
      </div>
    </Link>
  );
};