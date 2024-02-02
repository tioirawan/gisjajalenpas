/* eslint-disable @next/next/no-img-element */
import useSelectedFeatureStore from "@/app/stores/selected_feature_store";
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
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

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

export default function RoadConditionSidebar() {
  const { selectedFeature, setSelectedFeature } = useSelectedFeatureStore(
    (selectedFeature) => ({
      selectedFeature: selectedFeature.selectedFeature,
      setSelectedFeature: selectedFeature.setSelectedFeature,
    })
  );

  return (
    <aside
      className={clsx(
        selectedFeature ? "lg:w-4/6 xl:w-1/3 w-full p-4 shrink-0" : "w-0 p-0",
        "transition-all duration-500 ease-in-out overflow-y-auto border-r h-full  bg-white"
      )}
    >
      <div>
        <div className="flex flex-row justify-between items-center pb-4">
          <h1 className="text-xl font-bold">Kondisi Jalan</h1>

          <button
            className="text-xl font-bold"
            onClick={() => {
              setSelectedFeature(null);
            }}
          >
            <IoClose />
          </button>
        </div>

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
                <td className="w-1/3 font-bold">Nama Ruas</td>
                <td className="w-2/3">: Jatisari - Pucangsari</td>
              </tr>
              <tr>
                <td className="w-1/3 font-bold">Kecamatan yang dilalui</td>
                <td className="w-2/3">: Purwodadi</td>
              </tr>
              <tr>
                <td className="w-1/3 font-bold">Panjang SK</td>
                <td className="w-2/3">: 1,650 Km</td>
              </tr>
              <tr>
                <td className="w-1/3 font-bold">Lebar</td>
                <td className="w-2/3">: 2,4 m</td>
              </tr>
              <tr>
                <td className="w-1/3 font-bold">Keterangan</td>
                <td className="w-2/3">: -</td>
              </tr>
            </tbody>
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.col1}>
                  <TableCell>{invoice.col1}</TableCell>
                  <TableCell>{invoice.col2}</TableCell>
                  <TableCell>{invoice.col3}</TableCell>
                  <TableCell>{invoice.col4}</TableCell>
                </TableRow>
              ))}
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
                  <TableCell>{condition.col1}</TableCell>
                  <TableCell>{condition.col2}</TableCell>
                  <TableCell>{condition.col3}</TableCell>
                  <TableCell>{condition.col4}</TableCell>
                  <TableCell>{condition.col5}</TableCell>
                  <TableCell>{condition.col6}</TableCell>
                  <TableCell>{condition.col7}</TableCell>
                  <TableCell>{condition.col8}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </aside>
  );
}
