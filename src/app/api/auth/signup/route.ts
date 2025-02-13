import { NextResponse } from "next/server"
import { createUser, findUser, generateToken } from "@/app/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await findUser(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    const newUser = await createUser(name, email, password)
    const token = generateToken(newUser.id)

    return NextResponse.json({ user: newUser, token }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

