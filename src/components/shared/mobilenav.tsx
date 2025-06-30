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
        side={"top"}
        className="bg-background/40 rounded-b-3xl rounded-br-lg rounded-bl-lg pb-3 backdrop-blur-md"
      >
        <SheetHeader className="mb-3 text-start">
          <div className="flex w-full items-center gap-12">
            <p className="font-semibold text-yellow-500">Tumaini fitness</p>
            <ModeToggle />
          </div>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Mobile;
