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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-7xl ink-gradient">404</h1>
        <h2 className="mt-3 text-xl font-medium text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-muted-ink">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Back to start
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-2xl ink-gradient">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-ink">Try refreshing this page.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center rounded-full glass px-6 text-sm font-medium text-ink"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Veda Brands — We Build Brands That People Remember" },
      {
        name: "description",
        content:
          "Veda Brands is a premium branding agency crafting brand strategy, websites, social media marketing, SEO and digital growth for ambitious companies.",
      },
      { name: "author", content: "Veda Brands" },
      { property: "og:site_name", content: "Veda Brands" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Veda Brands — We Build Brands That People Remember" },
      { property: "og:description", content: "Veda Brands is a premium, ultra-modern branding agency website builder." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f5f6fa" },
      { name: "twitter:title", content: "Veda Brands — We Build Brands That People Remember" },
      { name: "description", content: "Veda Brands is a premium, ultra-modern branding agency website builder." },
      { name: "twitter:description", content: "Veda Brands is a premium, ultra-modern branding agency website builder." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/34b72f77-9066-478c-ae1a-f36b13a2a3e3/id-preview-0d7bb958--eacc023e-c511-4179-89a8-2ddb8301fb39.lovable.app-1782636611592.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/34b72f77-9066-478c-ae1a-f36b13a2a3e3/id-preview-0d7bb958--eacc023e-c511-4179-89a8-2ddb8301fb39.lovable.app-1782636611592.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
