import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { navItemsAdmin } from "@/data/constant";
import Link from "next/link";
import Logo from "../logo";

export default function AdminSidebar() {
  return (
    <nav className="hidden h-screen space-y-6 border-r bg-[#121621] px-2 py-4 text-white/90 xl:flex xl:flex-col">
      <Logo />

      <div className="flex flex-col gap-1">
        {navItemsAdmin.map(({ title, list }) => (
          <div key={title} className="space-y-3">
            <div className="font-bold">{title}</div>

            <div className="flex flex-col gap-1">
              {list.map((listItem) => (
                <Link href={listItem.link} key={listItem.id}>
                  <div>
                    {listItem.sub.length > 0 && (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger className="rounded-md from-red-500 to-orange-300 p-2 hover:bg-gradient-to-tl hover:text-white">
                            <div className="flex w-full items-center gap-3">
                              <div>
                                <listItem.icon />
                              </div>
                              <span>{listItem.name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div>
                              {listItem.sub.map((item) => (
                                <Link key={item.id} href={item.link}>
                                  <div>{item.name}</div>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                    {listItem.sub.length === 0 && (
                      <div
                        key={listItem.id}
                        className="flex items-center gap-3 rounded-md from-red-500 to-orange-300 p-2.5 hover:bg-gradient-to-tl hover:text-white"
                      >
                        <div>
                          <listItem.icon />
                        </div>
                        <span>{listItem.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
