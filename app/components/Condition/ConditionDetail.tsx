/* eslint-disable @next/next/no-img-element */
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { RuasWithSta } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownCircle, Eye } from "lucide-react";
import { useEffect, useState } from "react";

type ConditionDetailProps = {
  ruas: RuasWithSta;
};
export default function ConditionDetail({ ruas }: ConditionDetailProps) {
  const { setSelectedSta } = useSelectedStaStore((selectedSta) => ({
    setSelectedSta: selectedSta.set,
  }));

  const [panjangJalan, setPanjangJalan] = useState(0);

  // kondisi jalan
  const [baik, setBaik] = useState(0);
  const [sedang, setSedang] = useState(0);
  const [rusakRingan, setRusakRingan] = useState(0);
  const [rusakBerat, setRusakBerat] = useState(0);

  // permukaan
  const [aspal, setAspal] = useState(0);
  const [beton, setBeton] = useState(0);
  const [kerikil, setKerikil] = useState(0);
  const [tanah, setTanah] = useState(0);

  const formatSta = (sta: string) => {
    return parseInt(sta.replace(/\+/g, ""));
  };

  const sortSta = (sta: any = []) => {
    return sta.sort((a: any, b: any) => formatSta(a.sta) - formatSta(b.sta));
  };

  const clearCondition = () => {
    setBaik(0);
    setSedang(0);
    setRusakRingan(0);
    setRusakBerat(0);

    setAspal(0);
    setBeton(0);
    setKerikil(0);
    setTanah(0);
  };

  useEffect(() => {
    const cekPanjangJalan = () => {
      if (ruas?.sta) {
        sortSta(ruas.sta);
        const sta = ruas.sta[ruas.sta.length - 1].sta;
        const panjang = formatSta(sta);
        setPanjangJalan(panjang);
      }
    };

    const cekPanjangTiapKondisi = () => {
      if (ruas?.sta) {
        clearCondition();
        sortSta(ruas.sta);
        ruas.sta.forEach((sta: any, index: number) => {
          if (sta.kondisi === "Baik") {
            setBaik((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.kondisi === "Sedang") {
            setSedang((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.kondisi === "Rusak Ringan") {
            setRusakRingan((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.kondisi === "Rusak Berat") {
            setRusakBerat((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          }

          if (sta.perkerasan === "Aspal") {
            setAspal((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.perkerasan === "Beton") {
            setBeton((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.perkerasan === "Kerikil") {
            setKerikil((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.perkerasan === "Tanah") {
            setTanah((prev) =>
              index > 0
                ? prev + formatSta(sta.sta) - formatSta(ruas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          }
        });
      }
    };

    cekPanjangJalan();
    cekPanjangTiapKondisi();
  }, [ruas, sortSta]);

  return (
    <>
      {ruas && ruas?.pictures?.length > 0 && (
        <Carousel
          opts={{
            align: "end",
          }}
          className="w-full"
        >
          <CarouselContent>
            {ruas?.pictures.map((picture, index) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex h-48 items-center justify-center p-0">
                      <img
                        className="w-full h-full object-cover"
                        src={picture.picture.path}
                        alt={picture.description ?? ""}
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
      )}
      <div className="w-full p-1 mt-6">
        <table className="w-full">
          {ruas && (
            <tbody className="w-full">
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Nomor Ruas</td>
                <td className="w-1/2">: {ruas.nomorRuas}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Nama Ruas</td>
                <td className="w-1/2">: {ruas.namaRuas}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Kecamatan</td>
                <td className="w-1/2">: {ruas.kecamatan}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">panjang SK</td>
                <td className="w-1/2">: {ruas.panjangSK}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Lebar</td>
                <td className="w-1/2">: {ruas.lebar}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Latitude</td>
                <td className="w-1/2">: {ruas.latitude}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Longitude</td>
                <td className="w-1/2">: {ruas.longitude}</td>
              </tr>
              <tr className="w-full text-sm sm:text-md">
                <td className="w-1/2 font-bold">Keterangan</td>
                <td className="w-1/2">: {ruas.keterangan}</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {ruas?.sta && ruas.sta.length > 0 && (
        <>
          <div className="w-full p-1 mt-6">
            <h6 className="font-bold flex gap-2 items-center text-sm sm:text-md">
              <ChevronDownCircle size={14} /> PANJANG TIPE PERMUKAAN
            </h6>
            <Table className="mt-3">
              <TableHeader>
                <TableRow className="text-xs sm:text-md">
                  <TableHead className="font-bold text-black ">
                    ASPAL / PENETRASI / MAKADAM
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    PERKERASAN BETON
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    TELFORD / KERIKIL
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    TANAH / BELUM TEMBUS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-xs sm:text-md">
                  <TableCell className="text-gray-500">{aspal}</TableCell>
                  <TableCell className="text-gray-500">{beton}</TableCell>
                  <TableCell className="text-gray-500">{kerikil}</TableCell>
                  <TableCell className="text-gray-500">{tanah}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="w-full p-1 mt-6">
            <h6 className="font-bold flex items-center gap-2 text-sm sm:text-md">
              <ChevronDownCircle size={14} /> PANJANG TIAP KONDISI
            </h6>
            <Table className="mt-3">
              <TableHeader>
                <TableRow className="text-xs sm:text-md">
                  <TableHead
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    BAIK
                  </TableHead>
                  <TableHead
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    SEDANG
                  </TableHead>
                  <TableHead
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    RUSAK RINGAN
                  </TableHead>
                  <TableHead
                    className="text-center text-black font-bold"
                    colSpan={2}
                  >
                    RUSAK BERAT
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableHeader>
                <TableRow className="text-xs sm:text-md">
                  <TableHead className="text-black font-bold">m</TableHead>
                  <TableHead className="text-black font-bold">%</TableHead>
                  <TableHead className="text-black font-bold">m</TableHead>
                  <TableHead className="text-black font-bold">%</TableHead>
                  <TableHead className="text-black font-bold">m</TableHead>
                  <TableHead className="text-black font-bold">%</TableHead>
                  <TableHead className="text-black font-bold">m</TableHead>
                  <TableHead className="text-black font-bold">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-xs sm:text-md">
                  <TableCell className="text-gray-500">
                    {baik > 0 ? baik : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {baik > 0 ? ((baik / panjangJalan) * 100).toFixed(2) : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {sedang > 0 ? sedang : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {sedang > 0
                      ? ((sedang / panjangJalan) * 100).toFixed(2)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakRingan > 0 ? rusakRingan : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakRingan > 0
                      ? ((rusakRingan / panjangJalan) * 100).toFixed(2)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakBerat > 0 ? rusakBerat : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {rusakBerat > 0
                      ? ((rusakBerat / panjangJalan) * 100).toFixed(2)
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="w-full p-1 mt-6">
            <h6 className="font-bold flex items-center gap-2 text-sm sm:text-md">
              <ChevronDownCircle size={14} /> RINCIAN DATA PER STA
            </h6>
            <Table className="mt-3">
              <TableHeader>
                <TableRow className="text-xs sm:text-md">
                  <TableHead className="font-bold text-black">
                    NOMOR RUAS
                  </TableHead>
                  <TableHead className="font-bold text-black">STA</TableHead>
                  <TableHead className="font-bold text-black">
                    TIPE PERMUKAAN
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    KONDISI
                  </TableHead>
                  <TableHead className="font-bold text-black">DETAIL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ruas?.sta &&
                  ruas.sta.map((sta: any) => {
                    sortSta(ruas.sta);
                    return (
                      <TableRow key={sta.id} className="text-xs sm:text-md">
                        <TableCell className="text-gray-500">
                          {sta.nomorRuas}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {sta.sta}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {sta.perkerasan}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {sta.kondisi}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => setSelectedSta(sta)}>
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
