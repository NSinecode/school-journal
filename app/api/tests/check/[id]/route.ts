import { db } from '@/db/db'
import { testsTable } from '@/db/schema/tests-schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const test = await db.query.tests.findFirst({
      where: eq(testsTable.id, parseInt(context.params.id))
    })

    if (test) {
      return NextResponse.json({ status: 'completed' })
    }
    
    return NextResponse.json({ status: 'pending' })
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error }, { status: 500 })
  }
}