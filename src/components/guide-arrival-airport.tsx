import { GuideYellowChecklist } from "@/components/guide-yellow-checklist";

export function GuideArrivalAirport({
  banner,
  steps,
  photo,
}: {
  banner: string;
  steps: string[];
  photo?: string;
}) {
  return (
    <div className="guide__arrival-airport">
      <GuideYellowChecklist banner={banner} items={steps} photo={photo} />
    </div>
  );
}
