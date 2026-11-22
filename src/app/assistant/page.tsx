import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Assistant } from "@/components/ai/assistant";

export const metadata: Metadata = { title: "AI Assistant" };

export default function AssistantPage() { return <div className="grid gap-6"><PageHeader title="AI Financial Assistant" description="Get practical explanations based on your recorded financial activity."/><SectionCard title="Ask a question" description="Your records are summarized on the server and sent only for this request."><Assistant/></SectionCard></div>; }
