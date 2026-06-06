import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";

interface MobileProps {
  classname?: string;
}

function Mobile({ classname }: MobileProps) {
  return (
    <Sheet>
      <SheetTrigger className={cn(classname)}>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="bg-background/40 rounded-b-3xl rounded-br-lg rounded-bl-lg pb-3 backdrop-blur-md"
      >
        <SheetHeader className="mb-3 text-start">
          <p className="font-semibold text-yellow-500">Tumaini fitness</p>
        </SheetHeader>
        <div className="flex flex-col space-y-2">
          <SheetClose className="ml-3 w-64 text-start" asChild>
            <Link href={"/nutrition"} className="w-full text-white">
              Nutrition
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="ml-3 w-64 text-start" asChild>
            <Link href={"/about"} className="w-full text-white">
              About us
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="ml-3 w-64 text-start" asChild>
            <Link href={"/contact"} className="w-full text-white">
              Contact
            </Link>
          </SheetClose>

          <Separator />

          {/* Theme switcher - redesigned icon, accessible here in the mobile sheet (not in the header top) */}
          <div className="ml-3 flex w-64 items-center gap-3 py-2 text-white hover:bg-white/5 rounded-sm transition-colors">
            <span className="flex-1">Theme</span>
            <ModeToggle classname="h-8 w-8 shrink-0" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Mobile;
