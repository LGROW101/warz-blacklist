import { ShieldAlert } from "lucide-react"
import Image from "next/image"
import { ScammerSearch } from "@/components/scammer-search"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-balance">ตรวจสอบคนโกง</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <Image
              src="/warz-logo.png"
              alt="WarZ Siam MMO"
              width={400}
              height={120}
              className="object-contain w-auto"
              loading="eager"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            เช็คก่อนซื้อขาย <span className="text-primary">ปลอดภัยกว่า</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 text-pretty">
            ค้นหารายชื่อคนโกงในการซื้อขายไอเทม WarZ Siam MMO - วอซีสยามรีเทิร์น
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 pb-16">
        <ScammerSearch />
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-3 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>ข้อมูลนี้รวบรวมจากการรายงานของสมาชิก กรุณาใช้วิจารณญาณในการตัดสินใจ</p>
        </div>
      </footer>
    </main>
  )
}