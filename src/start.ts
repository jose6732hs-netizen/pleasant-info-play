import { createStart, createCsrfMiddleware, createMiddleware, registerGlobalMiddleware } from "@tanstack/react-start";
import { renderErrorPage } from "./lib/error-page";

const authMiddleware = createMiddleware().client(async ({ next }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("064_auth_token") : null;
  if (token) {
    (window as any).headers = {
      ...(window as any).headers,
      Authorization: `Bearer ${token}`
    };
  }
  return next();
}).server(async ({ next, sendContext }) => {
  const token = sendContext.request.headers.get("Authorization")?.replace("Bearer ", "");
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
