import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ==========================
// UPDATE DOCTOR
// ==========================

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;

    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid doctor id",
        },
        {
          status: 400,
        },
      );
    }

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

    const result = await pool.query(
      `
      UPDATE doctors

      SET
        name = $1,
        department = $2,
        experience = $3,
        email = $4,
        location = $5,
        time = $6,
        rating = $7,
        image = $8

      WHERE id = $9

      RETURNING *
      `,
      [
        name,
        department,
        experience,
        email,
        location,
        time,
        rating,
        image,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Doctor updated successfully",
      doctor: result.rows[0],
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
// DELETE DOCTOR
// ==========================

export async function DELETE(
  req,
  { params },
) {
  try {
    const resolvedParams = await params;

    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid doctor id",
        },
        {
          status: 400,
        },
      );
    }

    const result = await pool.query(
      `
      DELETE FROM doctors

      WHERE id = $1

      RETURNING *
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Doctor deleted successfully",
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