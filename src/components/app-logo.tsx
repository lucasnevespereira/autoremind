import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <Image src={logoSquare} alt="AutoRemind" width={80} height={80} />
      </div>
      <span className="font-semibold text-lg text-foreground tracking-tight">
        AutoRemind
      </span>
    </div>
  );
}
