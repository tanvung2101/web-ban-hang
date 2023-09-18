import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req, res) {
    console.log(req.cookies.authToken)
    const response = new NextResponse()
}