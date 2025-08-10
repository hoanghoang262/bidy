import type { PropsWithChildren } from "react";

import QueryProviders from "./query-client.provider";
import ThemeProvider from "./theme.provider";
import StoreProvider from "./store.provider";
import ValidationProvider from "./validation.provider";

export default function Provider({ children }: PropsWithChildren) {
  return (
    <ValidationProvider>
      <StoreProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <QueryProviders>{children}</QueryProviders>
        </ThemeProvider>
      </StoreProvider>
    </ValidationProvider>
  );
}
