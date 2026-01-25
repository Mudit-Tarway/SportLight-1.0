import { VideoChecker } from "@/components/video/video-checker";
import { VideoGuidance } from "@/components/video/video-guidance";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ToolsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground">Leverage AI to perfect your submission videos.</p>
      </div>
      <Tabs defaultValue="guidance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="guidance">Video Guidance</TabsTrigger>
          <TabsTrigger value="checker">Video Checker</TabsTrigger>
        </TabsList>
        <TabsContent value="guidance" className="mt-6">
            <VideoGuidance />
        </TabsContent>
        <TabsContent value="checker" className="mt-6">
            <VideoChecker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
