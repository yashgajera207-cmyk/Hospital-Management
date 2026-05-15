import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ==============================
// UPDATE APPOINTMENT
// ==============================

export async function PUT(req, { params }) {
  try {
    // NEXT JS 15 FIX
    const resolvedParams = await params;

    const id = Number(resolvedParams.id);

    // INVALID ID
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,

          message: "Invalid appointment id",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const {
      status,
      appointment_date,
      appointment_time,
    } = body;

    // ==============================
    // VALIDATION
    // ==============================

    // ACCEPTED PATIENT MUST HAVE DATE & TIME
    if (
      status === "Accepted" &&
      (!appointment_date ||
        !appointment_time)
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Date & time required",
        },
        {
          status: 400,
        },
      );
    }

    // ==============================
    // FORMAT DATE
    // ==============================

    let formattedDate = null;

    if (appointment_date) {
      formattedDate = new Date(
        appointment_date,
      )
        .toISOString()
        .split("T")[0];
    }

    // ==============================
    // FORMAT TIME
    // ==============================

    let formattedTime = null;

    if (appointment_time) {
      formattedTime =
        appointment_time.length === 5
          ? `${appointment_time}:00`
          : appointment_time;
    }

    // ==============================
    // UPDATE QUERY
    // ==============================

    const result = await pool.query(
      `
        UPDATE appointments

        SET
          status = COALESCE($1, status),

          appointment_date = COALESCE(
            $2,
            appointment_date
          ),

          appointment_time = COALESCE(
            $3,
            appointment_time
          )

        WHERE id = $4

        RETURNING *
      `,
      [
        status || "Pending",

        formattedDate,

        formattedTime,

        id,
      ],
    );

    // ==============================
    // NOT FOUND
    // ==============================

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Appointment not found",
        },
        {
          status: 404,
        },
      );
    }

    // ==============================
    // SUCCESS
    // ==============================

    return NextResponse.json({
      success: true,

      message:
        "Appointment updated successfully",

      appointment: result.rows[0],
    });
  } catch (error) {
    console.log("PUT ERROR:", error);

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
// DELETE APPOINTMENT
// ==============================

export async function DELETE(req, { params }) {
  try {
    // NEXT JS 15 FIX
    const resolvedParams = await params;

    const id = Number(resolvedParams.id);

    // INVALID ID
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,

          message: "Invalid appointment id",
        },
        {
          status: 400,
        },
      );
    }

    // ==============================
    // DELETE QUERY
    // ==============================

    const result = await pool.query(
      `
        DELETE FROM appointments

        WHERE id = $1

        RETURNING *
      `,
      [id],
    );

    // ==============================
    // NOT FOUND
    // ==============================

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Appointment not found",
        },
        {
          status: 404,
        },
      );
    }

    // ==============================
    // SUCCESS
    // ==============================

    return NextResponse.json({
      success: true,

      message:
        "Appointment deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);

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