import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SecretShortcut } from "@/app/components/SecretShortcut";
import NotFoundPage from "@/components/NotFoundPage";

function NotFoundComponent() {
  return <NotFoundPage />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const gscVerification =
      typeof process !== "undefined" && process.env?.VITE_GSC_VERIFICATION
        ? process.env.VITE_GSC_VERIFICATION
        : (import.meta as any).env?.VITE_GSC_VERIFICATION || "";

    const ga4Id =
      typeof process !== "undefined" && process.env?.VITE_GA4_ID
        ? process.env.VITE_GA4_ID
        : (import.meta as any).env?.VITE_GA4_ID || "";

    const clarityId =
      typeof process !== "undefined" && process.env?.VITE_CLARITY_ID
        ? process.env.VITE_CLARITY_ID
        : (import.meta as any).env?.VITE_CLARITY_ID || "";

    const metaList: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#EF4D23" },
      { title: "Lumen & Co | Creative Digital Marketing Agency in India" },
      {
        name: "description",
        content:
          "AI-powered creative agency from India. Gen AI ads, reels, SEO, Meta ads and CRO for brands in India and the US. Book a free strategy call.",
      },
      { name: "author", content: "Sahit Sai Pothala" },
      { property: "og:site_name", content: "Lumen & Co" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ];

    if (gscVerification) {
      metaList.push({ name: "google-site-verification", content: gscVerification });
    }

    const scriptList: Array<{ type?: string; src?: string; async?: boolean; children?: string }> = [];

    if (ga4Id) {
      scriptList.push({
        src: `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`,
        async: true,
      });
      scriptList.push({
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${ga4Id}');`,
      });
    }

    if (clarityId) {
      scriptList.push({
        children: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`,
      });
    }

    return {
      meta: metaList,
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap",
        },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
      ],
      scripts: scriptList,
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { ToastProvider } from "@/app/components/ui/Toast";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SecretShortcut />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </ToastProvider>
    </QueryClientProvider>
  );
}
