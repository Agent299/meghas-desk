import { PageTitle } from "@/components/dashboard/page-title"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center">
      <div className="flex w-full items-center gap-1 px-3 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <PageTitle />
        <ModeToggle className="ml-auto" />
      </div>
    </header>
  )
}
