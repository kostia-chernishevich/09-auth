// app/api/users/me/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

export async function GET() {
  try {
    const store = cookies();

    const res = await api.get("/users/me", {
      headers: { Cookie: store.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(error.response?.data, {
        status: error.status,
      });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const store = cookies();

    const res = await api.patch("/users/me", body, {
      headers: { Cookie: store.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(error.response?.data, {
        status: error.status,
      });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
