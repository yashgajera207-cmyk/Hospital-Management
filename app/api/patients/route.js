import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ==============================
// GET PATIENTS
// ==============================

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT *
      FROM patients
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      patients: result.rows,
    });
  } catch (error) {
    console.log("GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// ADD PATIENT
// ==============================

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      gender,
      address,
      doctor,
      description,
      wardType,
    } = body;

    // VALIDATION

    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !doctor ||
      !wardType
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // INSERT

    const result = await pool.query(
      `
      INSERT INTO patients
      (
        name,
        phone,
        email,
        gender,
        address,
        doctor,
        description,
        ward_type,
        status
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
        $8,
        $9
      )

      RETURNING *
      `,
      [
        name,
        phone,
        email,
        gender,
        address,
        doctor,
        description,
        wardType,
        "Admitted",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Patient added successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.log("POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}