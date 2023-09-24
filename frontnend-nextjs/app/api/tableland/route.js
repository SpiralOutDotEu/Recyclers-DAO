import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const tableName = searchParams.get('tableName')
  const apiUrl = `https://testnets.tableland.network/api/v1/query?statement=select%20%2A%20from%20`+tableName;
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  
  return NextResponse.json({ data })
}