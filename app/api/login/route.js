import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import pool from "@/lib/db";

// =====================================
// LOGIN API
// =====================================

export async function POST(req) {
  try {
    // =====================================
    // GET BODY
    // =====================================

    const body = await req.json();

    const { email, password } = body;

    // =====================================
    // VALIDATION
    // =====================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and Password are required",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================
    // FIND USER
    // =====================================

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
    `,
      [email]
    );

    // USER NOT FOUND

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Email",
        },
        {
          status: 400,
        }
      );
    }

    const user = result.rows[0];

    // =====================================
    // PASSWORD CHECK
    // =====================================

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Password",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================
    // USER ROLE
    // =====================================

    const role = user.role || "user";

    // =====================================
    // CREATE JWT TOKEN
    // =====================================

    const token = jwt.sign(
      {
        id: user.id,
        role,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    // =====================================
    // REDIRECT BASED ON ROLE
    // =====================================

    const redirect =
      role === "admin"
        ? "/admin/dashboard"
        : "/users/dashboard";

    // =====================================
    // RESPONSE
    // =====================================

    const response = NextResponse.json({
      success: true,
      message: "Login Successful",
      role,
      redirect,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });

    // =====================================
    // SET COOKIE
    // =====================================

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.log("LOGIN ERROR:", error);

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