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
        <Menu />
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="rounded-bl-lg rounded-br-lg bg-background/60 backdrop-blur-md"
      >
        <SheetHeader className="mb-3 text-start">
          <p className="font-semibold text-primary">Tumaini fitness</p>
        </SheetHeader>
        <div className="flex flex-col space-y-2">
          <SheetClose className="w-64 text-start ml-3" asChild>
            <Link href={"/nutrition"} className="w-full">
              Nutrition
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start ml-3" asChild>
            <Link href={"/about"} className="w-full">
              About us
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start ml-3" asChild>
            <Link href={"/contact"} className="w-full">
              Contact
            </Link>
          </SheetClose>
          <Separator />
          <SheetClose className="w-64 text-start ml-3 " asChild>
            <span className="flex gap-3 items-center">
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
