import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "database",
      "word-dictionary.json",
    )
    const fileContents = await fs.readFile(filePath, "utf8")
    const dictionary = JSON.parse(fileContents)

    // Extract words from the dictionary object (keys are the words)
    const words = Object.keys(dictionary)

    return NextResponse.json({ words })
  } catch (error) {
    console.error("Error loading dictionary:", error)
    return NextResponse.json(
      { error: "Failed to load dictionary" },
      { status: 500 },
    )
  }
}
