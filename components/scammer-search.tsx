"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, AlertTriangle, CheckCircle, User, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { type Scammer } from "@/lib/google-sheets"

export function ScammerSearch() {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [scammers, setScammers] = useState<Scammer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/scammers")
        const data = await response.json()
        setScammers(data)
      } catch (error) {
        console.error("Failed to fetch scammers:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const searchTerm = query.toLowerCase().trim()
    return scammers.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm) ||
        s.facebook?.toLowerCase().includes(searchTerm) ||
        s.bankAccount?.toLowerCase().includes(searchTerm) ||
        s.bankName?.toLowerCase().includes(searchTerm) ||
        s.details?.toLowerCase().includes(searchTerm)
    )
  }, [query, scammers])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      setHasSearched(true)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="พิมพ์ชื่อ, Facebook, หรือเลขบัญชีเพื่อค้นหา..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 h-14 text-lg bg-secondary border-border focus:border-primary focus:ring-primary"
        />
      </div>

      {/* Stats */}
      <div className="text-center text-sm text-muted-foreground">
        มีรายชื่อในระบบทั้งหมด <span className="text-primary font-semibold">{scammers.length}</span> รายการ
      </div>

      {/* Results */}
      {hasSearched && query.trim() && (
        <div className="space-y-4">
          {results.length > 0 ? (
            <>
              {/* Warning Banner */}
              <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">พบรายชื่อในระบบ!</p>
                  <p className="text-sm text-muted-foreground">
                    พบ {results.length} รายการที่ตรงกับการค้นหา กรุณาระวังในการทำธุรกรรม
                  </p>
                </div>
              </div>

              {/* Result Cards */}
              <div className="space-y-3">
                {results.map((scammer) => (
                  <ScammerCard key={scammer.id} scammer={scammer} searchQuery={query} />
                ))}
              </div>
            </>
          ) : (
            /* Safe Banner */
            <div className="bg-success/20 border border-success/50 rounded-lg p-6 flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-success shrink-0" />
              <div>
                <p className="font-semibold text-success">ไม่พบในระบบ</p>
                <p className="text-sm text-muted-foreground">
                  ไม่พบรายชื่อ &quot;{query}&quot; ในฐานข้อมูล แต่ยังควรระวังและตรวจสอบให้ดีก่อนทำธุรกรรม
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScammerCard({ scammer, searchQuery }: { scammer: Scammer; searchQuery: string }) {
  const highlightText = (text: string) => {
    if (!searchQuery.trim() || !text) return text
    const regex = new RegExp(`(${searchQuery.trim()})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-warning text-warning-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <Card className="bg-card border-destructive/30 hover:border-destructive/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="bg-destructive/20 p-3 rounded-full shrink-0">
            <User className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">

            {/* ชื่อ */}
            <p className="font-semibold text-lg">{highlightText(scammer.name)}</p>

            {/* Facebook */}
            {scammer.facebook && (
              <p className="text-sm">
                <span className="text-muted-foreground">Facebook: </span>
                {highlightText(scammer.facebook)}
              </p>
            )}

            {/* เลขบัญชี + ธนาคาร */}
            {(scammer.bankAccount || scammer.bankName) && (
              <div className="text-sm space-y-0.5">
                {scammer.bankAccount && (
                  <p>
                    <span className="text-muted-foreground">เลขบัญชี: </span>
                    <span className="font-mono">{highlightText(scammer.bankAccount)}</span>
                  </p>
                )}
                {scammer.bankName && (
                  <p>
                    <span className="text-muted-foreground">ธนาคาร: </span>
                    {highlightText(scammer.bankName)}
                  </p>
                )}
              </div>
            )}

            {/* หมายเหตุ */}
            {scammer.details && (
              <p className="text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded">
                {highlightText(scammer.details)}
              </p>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  )
}