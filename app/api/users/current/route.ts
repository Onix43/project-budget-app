import { cookies } from "next/headers";
import { api } from "../../api";
import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const apiRes = await api.get("/users/current", {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
