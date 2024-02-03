/* eslint-disable @next/next/no-img-element */
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function StaDetail() {
  const { selectedSta, setSelectedSta } = useSelectedStaStore(
    (selectedSta) => ({
      selectedSta: selectedSta.selected,
      setSelectedSta: selectedSta.set,
    })
  );

  return (
    <>
      <Carousel
        opts={{
          align: "end",
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="">
              <div className="p-1">
                <Card>
                  <CardContent className="flex h-48 items-center justify-center p-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1680264341897-6c4f620627bd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      <div className="w-full p-1 mt-6">
        <table className="w-full">
          <tbody className="w-full">
            <tr>
              <td className="w-1/3 font-bold">Nomor Ruas</td>
              <td className="w-2/3">: {selectedSta.nomorRuas}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">STA</td>
              <td className="w-2/3">: {selectedSta.sta}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">X Awal</td>
              <td className="w-2/3">: {selectedSta.xAwal}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">X Akhir</td>
              <td className="w-2/3">: {selectedSta.xAkhir}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Y Awal</td>
              <td className="w-2/3">: {selectedSta.yAwal}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Y Akhir</td>
              <td className="w-2/3">: {selectedSta.yAkhir}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Kondisi</td>
              <td className="w-2/3">: {selectedSta.kondisi}</td>
            </tr>
            <tr>
              <td className="w-1/3 font-bold">Perkerasan</td>
              <td className="w-2/3">: {selectedSta.perkerasan}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
