import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    // CHECK USER

    const existingUser = await pool.query(
      `
      SELECT * FROM users
      WHERE email = $1
    `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER

    await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
    `,
      [name, email, hashedPassword, "user"]
    );

    return NextResponse.json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}