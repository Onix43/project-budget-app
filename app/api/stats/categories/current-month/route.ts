import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { isAxiosError } from "axios";

import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const apiRes = await api.get(`/stats/categories/current-month`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
