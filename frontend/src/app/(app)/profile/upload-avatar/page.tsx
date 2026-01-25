"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePlayers } from "@/hooks/use-players";
import { Player } from "@/lib/mock-data";
import { UploadCloud } from "lucide-react";

function UploadAvatarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { players, updatePlayer } = usePlayers();
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const playerId = searchParams.get("playerId");
    if (playerId) {
      const foundPlayer = players.find(p => p.id === playerId);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      }
    }
  }, [searchParams, players, router, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!player || !previewUrl) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to upload for your profile picture.",
      });
      return;
    }

    try {
        await updatePlayer(player.id, { avatar: previewUrl });
        toast({
          title: "Profile Picture Updated",
          description: `${player.name}'s profile picture has been set.`,
        });
        router.push("/dashboard");
    } catch (e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: 'Update failed',
            description: 'Could not update profile picture.'
        });
    }
  };

  if (!player) {
    return (
        <div className="flex justify-center items-center h-full">
            <p>Loading player...</p>
        </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="font-headline">Upload Profile Picture</CardTitle>
                <CardDescription>Choose a profile picture for {player.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden">
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Profile preview" width={192} height={192} className="object-cover w-full h-full" />
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                <UploadCloud className="w-12 h-12 mx-auto" />
                                <p className="mt-2 text-sm">Image Preview</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="avatar-file">Profile Image</Label>
                    <Input id="avatar-file" type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={!imageFile}>
                    Save and Finish
                </Button>
            </CardFooter>
        </form>
    </Card>
  );
}


export default function UploadAvatarPage() {
    return (
        <div className="container mx-auto py-12">
            <Suspense fallback={<div>Loading...</div>}>
                <UploadAvatarForm />
            </Suspense>
        </div>
    )
}
