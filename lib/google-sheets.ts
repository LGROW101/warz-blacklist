export interface Scammer {
  id: number
  name: string
  facebook?: string
  bankAccount?: string
  bankName?: string
  details?: string
  reportedDate: string
}

const GOOGLE_SHEETS_CSV_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL || ""

export async function fetchScammersFromSheet(): Promise<Scammer[]> {
  if (!GOOGLE_SHEETS_CSV_URL) {
    throw new Error("ยังไม่ได้ตั้งค่า NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL")
  }

  const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`ดึงข้อมูลไม่สำเร็จ: ${response.status}`)
  }

  const csvText = await response.text()
  return parseCSV(csvText)
}

function parseCSV(csvText: string): Scammer[] {
  const lines = csvText.split("\n").filter((line) => line.trim())
  if (lines.length <= 1) return []

  return lines.slice(1).map((line, i) => {
    const values = parseCSVLine(line)
    return {
      id: i + 1,
      name: values[0]?.trim() || "",
      facebook: values[1]?.trim() || "",
      bankAccount: values[2]?.trim() || "",
      bankName: values[3]?.trim() || "",
      details: values[4]?.trim() || "",
      reportedDate: values[5]?.trim() || new Date().toISOString().split("T")[0],
    }
  }).filter((s) => s.name || s.facebook || s.bankAccount)
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      values.push(current)
      current = ""
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}