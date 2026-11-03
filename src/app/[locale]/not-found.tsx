import { getCMSData } from "@/lib/cms-store";
import { Animated404 } from "@/components/animated-404";

export const dynamic = "force-dynamic";

export default async function LocalizedNotFound() {
  const cms = await getCMSData();

  return (
    <Animated404
      currentLocale="en"
      phoneDisplay={cms.phoneDisplay}
      phone={cms.phone}
      representativeName={cms.representativeName}
    />
  );
}
