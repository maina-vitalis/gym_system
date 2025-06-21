import { reviews } from "@/config/reviews";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";
const Reviews = () => {
  return (
    <section className="mt-10 flex flex-col gap-5 md:flex-row">
      <div className="flex flex-col justify-between gap-5 px-6">
        <h1 className="text-2xl font-semibold text-white md:text-3xl">
          What Our Members <br /> Say About Us ?
        </h1>
      </div>

      <Carousel
        className="max-w-full self-end md:max-w-[50%]"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="">
          {reviews.map((review, index) => (
            <CarouselItem className="" key={index}>
              <Card className="border-transparent bg-blueBg text-white">
                <CardContent className="flex flex-col gap-4">
                  <p className="text-xs">{review.review}</p>

                  <div className="flex items-center gap-5">
                    <div className="flex flex-col text-sm">
                      <h2 className="font-semibold">{review.name} </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default Reviews;
