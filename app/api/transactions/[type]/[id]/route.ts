import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/_utils/utils";

interface Props {
  params: Promise<{ type: string[] }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const body = await req.json();
    const { type } = await params;
    console.log("Query", body);
    const cookieStore = await cookies();

    const apiRes = await api.patch(
      `/transactions/${type}/69d0f6254bb99635df766ed2`,
      body,
      {
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
      },
    );

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
