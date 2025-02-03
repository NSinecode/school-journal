import { db } from '@/db/db'
import { testsTable } from '@/db/schema/tests-schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// Use the correct type from Next.js
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function GET(
  request: NextRequest,
  props: Props
) {
  try {
    const test = await db.query.tests.findFirst({
      where: eq(testsTable.id, parseInt(props.params.id))
    })

    if (test) {
      return NextResponse.json({ status: 'completed' })
    }
    
    return NextResponse.json({ status: 'pending' })
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error }, { status: 500 })
  }
}