"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";

interface MainHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({ title }: MainHeaderProps) {
  //...
  const pathSegments = usePathname()
    .split("/")
    .filter((item) => item.length !== 0);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const link = pathSegments.slice(0, index + 1).join("/");
    return {
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      link: `/${link}`,
    };
  });

  return (
    <div className="flex items-center justify-between space-y-1 pb-6">
      <div className="space-y-2">
        <h1>{title}</h1>
      </div>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem
                key={breadcrumb.name}
                className="decoration-orange-400 underline-offset-8 hover:underline"
              >
                <BreadcrumbLink href={breadcrumb.link} className="text-[1rem]">
                  {breadcrumb.name}
                </BreadcrumbLink>
                {index < breadcrumbs.length - 1 && (
                  <div>
                    <Slash />
                  </div>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
