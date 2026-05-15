// app/api/patients/[id]/route.js

import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ==============================
// UPDATE PATIENT STATUS
// ==============================

export async function PUT(req, context) {
  try {
    // NEXT JS 15/16 FIX

    const params = await context.params;

    const id = Number(params.id);

    const body = await req.json();

    const { status } = body;

    // CHECK ID

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // UPDATE STATUS

    const result = await pool.query(
      `
      UPDATE patients
      SET status = $1
      WHERE id = $2
      RETURNING *
    `,
      [status, id],
    );

    // CHECK PATIENT

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Patient updated successfully",

      patient: result.rows[0],
    });

  } catch (error) {
    console.log(
      "UPDATE PATIENT ERROR:",
      error,
    );

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

// ==============================
// DELETE PATIENT
// ==============================

export async function DELETE(req, context) {
  try {
    // NEXT JS 15/16 FIX

    const params = await context.params;

    const id = Number(params.id);

    // CHECK ID

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // DELETE PATIENT

    const result = await pool.query(
      `
      DELETE FROM patients
      WHERE id = $1
      RETURNING *
    `,
      [id],
    );

    // CHECK PATIENT

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Patient deleted successfully",

      patient: result.rows[0],
    });

  } catch (error) {
    console.log(
      "DELETE PATIENT ERROR:",
      error,
    );

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