import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ==========================
// GET APPOINTMENTS
// ==========================

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT *
      FROM appointments
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      appointments: result.rows,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch appointments",
      },
      { status: 500 },
    );
  }
}

// ==========================
// CREATE APPOINTMENT
// ==========================

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      patientName,
      phone,
      email,
      gender,
      address,
      doctor,
      date,
      symptoms,
      userEmail,
    } = body;

    // VALIDATION

    if (
      !patientName ||
      !phone ||
      !email ||
      !gender ||
      !address ||
      !doctor ||
      !date ||
      !symptoms
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    // INSERT DATA

    const result = await pool.query(
      `
      INSERT INTO appointments (
        patient_name,
        phone,
        email,
        gender,
        address,
        doctor_name,
        appointment_date,
        symptoms,
        user_email,
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING *
      `,
      [
        patientName,
        phone,
        email,
        gender,
        address,
        doctor,
        date,
        symptoms,
        userEmail,
        "Pending",
      ],
    );

    return NextResponse.json({
      success: true,
      appointment: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create appointment",
      },
      { status: 500 },
    );
  }
}