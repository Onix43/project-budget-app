import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { api } from "../../api";

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();

    const apiRes = await api.patch(`/users/avatar`, formData, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "multipart/form-data",
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

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    const apiRes = await api.delete(`/users/avatar`, {
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
