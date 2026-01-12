import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'database', 'state-mottos.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const mottos = JSON.parse(fileContents)
    return NextResponse.json({ mottos })
  } catch (error) {
    console.error('Failed to load state mottos:', error)
    return NextResponse.json({ error: 'Failed to load state mottos' }, { status: 500 })
  }
}

