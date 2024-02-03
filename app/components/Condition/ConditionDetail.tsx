/* eslint-disable @next/next/no-img-element */
import useSelectedRuasStore from "@/app/stores/selected_ruas_store";
import useSelectedStaStore from "@/app/stores/selected_sta_store";
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
import { useEffect, useState } from "react";

const invoices = [
  {
    col1: "-",
    col2: " 0,600",
    col3: "-",
    col4: " 1,050",
  },
];

const conditions = [
  {
    col1: "-",
    col2: "-",
    col3: "0,600",
    col4: "36,36",
    col5: "-",
    col6: "-",
    col7: "1,050",
    col8: "63,64",
  },
];

export default function ConditionDetail() {
  const { selectedSta, setSelectedSta } = useSelectedStaStore(
    (selectedSta) => ({
      selectedSta: selectedSta.selected,
      setSelectedSta: selectedSta.set,
    })
  );
  const { selectedRuas, setSelectedRuas } = useSelectedRuasStore(
    (selectedRuas) => ({
      selectedRuas: selectedRuas.selected,
      setSelectedRuas: selectedRuas.set,
    })
  );

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

  const sortSta = (sta: any) => {
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
      if (selectedRuas) {
        sortSta(selectedRuas.sta);
        const sta = selectedRuas.sta[selectedRuas.sta.length - 1].sta;
        const panjang = formatSta(sta);
        setPanjangJalan(panjang);
      }
    };

    const cekPanjangTiapKondisi = () => {
      if (selectedRuas) {
        clearCondition();
        sortSta(selectedRuas.sta);
        selectedRuas.sta.forEach((sta: any, index: number) => {
          if (sta.kondisi === "Baik") {
            setBaik((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.kondisi === "Sedang") {
            setSedang((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.kondisi === "Rusak Ringan") {
            setRusakRingan((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.kondisi === "Rusak Berat") {
            setRusakBerat((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          }

          if (sta.perkerasan === "Aspal") {
            setAspal((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.perkerasan === "Beton") {
            setBeton((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.perkerasan === "Kerikil") {
            setKerikil((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          } else if (sta.perkerasan === "Tanah") {
            setTanah((prev) =>
              index > 0
                ? prev +
                  formatSta(sta.sta) -
                  formatSta(selectedRuas.sta[index - 1].sta)
                : prev + formatSta(sta.sta)
            );
          }
        });
      }
    };

    cekPanjangJalan();
    cekPanjangTiapKondisi();
  }, [selectedRuas]);

  console.log(rusakBerat, panjangJalan);
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
          {selectedRuas && (
            <tbody className="w-full">
              <tr className="w-full">
                <td className="w-1/2 font-bold">Nomor Ruas</td>
                <td className="w-1/2">: {selectedRuas.nomorRuas}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">Nama Ruas</td>
                <td className="w-1/2">: {selectedRuas.namaRuas}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">Kecamatan</td>
                <td className="w-1/2">: {selectedRuas.kecamatan}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">panjang SK</td>
                <td className="w-1/2">: {selectedRuas.panjangSK}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">Lebar</td>
                <td className="w-1/2">: {selectedRuas.lebar}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">Latitude</td>
                <td className="w-1/2">: {selectedRuas.latitude}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">Longitude</td>
                <td className="w-1/2">: {selectedRuas.longitude}</td>
              </tr>
              <tr className="w-full">
                <td className="w-1/2 font-bold">Keterangan</td>
                <td className="w-1/2">: {selectedRuas.keterangan}</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      <div className="w-full p-1 mt-6">
        <h6 className="font-bold">Panjang Tipe Permukaan</h6>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>ASPAL / PENETRASI / MAKADAM</TableHead>
              <TableHead>PERKERASAN BETON</TableHead>
              <TableHead>TELFORD / KERIKIL</TableHead>
              <TableHead>TANAH / BELUM TEMBUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{aspal}</TableCell>
              <TableCell>{beton}</TableCell>
              <TableCell>{kerikil}</TableCell>
              <TableCell>{tanah}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="w-full p-1 mt-6">
        <h6 className="font-bold">Panjang Tiap Kondisi</h6>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center" colSpan={2}>
                Baik
              </TableHead>
              <TableHead className="text-center" colSpan={2}>
                Sedang
              </TableHead>
              <TableHead className="text-center" colSpan={2}>
                Rusak Ringan
              </TableHead>
              <TableHead className="text-center" colSpan={2}>
                Rusak Berat
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableHeader>
            <TableRow>
              <TableHead>Km</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Km</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Km</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Km</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conditions.map((condition) => (
              <TableRow key={condition.col1}>
                <TableCell>{baik > 0 ? baik : "-"}</TableCell>
                <TableCell>
                  {baik > 0 ? ((baik / panjangJalan) * 100).toFixed(2) : "-"}
                </TableCell>
                <TableCell>{sedang > 0 ? sedang : "-"}</TableCell>
                <TableCell>
                  {sedang > 0
                    ? ((sedang / panjangJalan) * 100).toFixed(2)
                    : "-"}
                </TableCell>
                <TableCell>{rusakRingan > 0 ? rusakRingan : "-"}</TableCell>
                <TableCell>
                  {rusakRingan > 0
                    ? ((rusakRingan / panjangJalan) * 100).toFixed(2)
                    : "-"}
                </TableCell>
                <TableCell>{rusakBerat > 0 ? rusakBerat : "-"}</TableCell>
                <TableCell>
                  {rusakBerat > 0
                    ? ((rusakBerat / panjangJalan) * 100).toFixed(2)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full p-1 mt-6">
        <h6 className="font-bold">Rincian Data Per STA</h6>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Ruas</TableHead>
              <TableHead>STA</TableHead>
              <TableHead>Tipe Permukaan</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedRuas &&
              selectedRuas.sta.map((sta: any) => {
                sortSta(selectedRuas.sta);
                return (
                  <TableRow key={sta.id}>
                    <TableCell>{sta.nomorRuas}</TableCell>
                    <TableCell>{sta.sta}</TableCell>
                    <TableCell>{sta.perkerasan}</TableCell>
                    <TableCell>{sta.kondisi}</TableCell>
                    <TableCell>
                      <Button onClick={() => setSelectedSta(sta)}>
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
