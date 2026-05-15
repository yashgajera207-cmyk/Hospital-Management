import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ==========================
// GET DOCTORS
// ==========================

export async function GET() {
  try {
    const result = await pool.query(
      `
        SELECT *
        FROM doctors
        ORDER BY id DESC
      `,
    );

    return NextResponse.json({
      success: true,

      doctors: result.rows,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

// ==========================
// ADD DOCTOR
// ==========================

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      department,
      experience,
      email,
      location,
      time,
      rating,
      image,
    } = body;

    // VALIDATION
    if (!name || !department || !experience || !email || !location || !time) {
      return NextResponse.json(
        {
          success: false,

          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    await pool.query(
      `
      INSERT INTO doctors
      (
        name,
        department,
        experience,
        email,
        location,
        time,
        rating,
        image
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
    `,
      [
        name,
        department,
        experience,
        email,
        location,
        time,
        rating || "4.9",
        image || "",
      ],
    );

    return NextResponse.json({
      success: true,

      message: "Doctor added successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
