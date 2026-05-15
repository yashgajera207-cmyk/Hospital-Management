import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ==========================
// GET ALL COMPLETED APPOINTMENTS
// ==========================

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT *
      FROM completed_appointments
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
        message: "Unable to fetch completed appointments",
      },
      {
        status: 500,
      },
    );
  }
}

// ==========================
// CREATE COMPLETED APPOINTMENT
// ==========================

export async function POST(req) {
  try {
    const body = await req.json();

    console.log(body);

    const {
      patient_name,
      doctor_name,
      gender,
      phone,
      email,
      address,
      appointment_date,
      symptoms,
      health_score,
      status,
    } = body;

    const result = await pool.query(
      `
      INSERT INTO completed_appointments (
        patient_name,
        doctor_name,
        gender,
        phone,
        email,
        address,
        appointment_date,
        symptoms,
        health_score,
        status
      )

      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )

      RETURNING *
      `,
      [
        patient_name,
        doctor_name,
        gender,
        phone,
        email,
        address,
        appointment_date,
        symptoms,
        health_score,
        status,
      ],
    );

    return NextResponse.json({
      success: true,
      appointment: result.rows[0],
    });
  } catch (error) {
    console.log("COMPLETED APPOINTMENT ERROR:", error);

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
