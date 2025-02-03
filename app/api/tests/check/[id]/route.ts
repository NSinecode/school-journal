import { db } from '@/db/db'
import { tests } from '@/db/schema/tests-schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const test = await db.query.tests.findFirst({
      where: eq(tests.id, parseInt(params.id))
    })

    if (test) {
      return NextResponse.json({ status: 'completed' })
    }
    
    return NextResponse.json({ status: 'pending' })
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error }, { status: 500 })
  }
}