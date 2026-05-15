import { NextResponse } from "next/server";

import pool from "@/lib/db";

// ======================
// GET
// ======================

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT *
      FROM completed_records
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      records: result.rows,
    });
  } catch (error) {
    console.log("GET ERROR =>", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

// ======================
// POST
// ======================

export async function POST(req) {
  try {
    let body;

    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        {
          status: 400,
        },
      );
    }

    console.log("BODY => ", body);

    const {
      record_id,
      name,
      phone,
      email,
      gender,
      address,
      description,
      doctor,
      ward_type,
      status,
      type,
      completed_date,
      completed_time,
    } = body;

    // VALIDATION

   if (!name || !phone || !email || !address || !doctor)   {
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

    const result = await pool.query(
      `
      INSERT INTO completed_records
      (
        record_id,
        name,
        phone,
        email,
        gender,
        address,
        description,
        doctor,
        ward_type,
        status,
        type,
        completed_date,
        completed_time
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
        $9,
        $10,
        $11,
        $12,
        $13
      )

      RETURNING *
    `,
      [
        record_id,
        name,
        phone,
        email,
        gender,
        address,
        description,
        doctor,
        ward_type,
        status,
        type,
        completed_date,
        completed_time,
      ],
    );

    console.log("INSERTED => ", result.rows[0]);

    return NextResponse.json({
      success: true,
      message: "Completed Successfully",
      record: result.rows[0],
    });
  } catch (error) {
    console.log("POST ERROR =>", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

// ======================
// DELETE
// ======================

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID is required",
        },
        {
          status: 400,
        },
      );
    }

    await pool.query(
      `
      DELETE FROM completed_records
      WHERE id = $1
    `,
      [id],
    );

    return NextResponse.json({
      success: true,
      message: "Record Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR =>", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
