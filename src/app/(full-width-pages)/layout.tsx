import {LocaleProvider} from "@/hooks/useLocales";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>

    <LocaleProvider initialLocale="en">
      {children}
    </LocaleProvider>

  </div>;
}
