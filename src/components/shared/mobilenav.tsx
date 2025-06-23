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
        className="bg-background/60 rounded-br-lg rounded-bl-lg backdrop-blur-md"
      >
        <SheetHeader className="mb-3 text-start">
          <p className="text-primary font-semibold">Tumaini fitness</p>
        </SheetHeader>
        <div className="flex flex-col space-y-2">
          <SheetClose className="ml-3 w-64 text-start" asChild>
            <Link href={"/nutrition"} className="w-full">
              Nutrition
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="ml-3 w-64 text-start" asChild>
            <Link href={"/about"} className="w-full">
              About us
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="ml-3 w-64 text-start" asChild>
            <Link href={"/contact"} className="w-full">
              Contact
            </Link>
          </SheetClose>
          <Separator />
          <SheetClose className="ml-3 w-64 text-start" asChild>
            <span className="flex items-center gap-3">
              <ModeToggle />
              <p className="text-sm">Toggle Mode</p>
            </span>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Mobile;
