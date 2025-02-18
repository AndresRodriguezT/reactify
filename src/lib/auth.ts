import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"

// Mock database
const users: { id: number; name: string; email: string; password: string }[] = []

// Secret key for JWT (in a real app, store this in an environment variable)
const JWT_SECRET = "your-secret-key"

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hash(password, 10)
  const newUser = { id: users.length + 1, name, email, password: hashedPassword }
  users.push(newUser)
  return { id: newUser.id, name: newUser.name, email: newUser.email }
}

export async function findUser(email: string) {
  return users.find((user) => user.email === email)
}

export async function validatePassword(user: { password: string }, inputPassword: string) {
  return compare(inputPassword, user.password)
}

export function generateToken(userId: number) {
  return sign({ userId }, JWT_SECRET, { expiresIn: "1h" })
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { userId: number }
  } catch {
    return null
  }
}

