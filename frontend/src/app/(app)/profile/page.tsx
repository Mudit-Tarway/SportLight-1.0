
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePlayers } from "@/hooks/use-players";
import { useClubs } from "@/hooks/use-clubs";
import { useToast } from "@/hooks/use-toast";
import { AchievementGenerator } from "@/components/profile/achievement-generator";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_SPORTS, PerformanceMetric, Player, Club } from "@/lib/mock-data";
import { PlusCircle, Trash2, CalendarIcon, LogOut, Loader } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const playerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sport: z.enum(ALL_SPORTS),
  age: z.coerce.number().min(1, "Age is required"),
  location: z.string().min(1, "Location is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  height: z.coerce.number().min(1, "Height is required"),
  weight: z.coerce.number().min(1, "Weight is required"),
  gender: z.enum(["Male", "Female"]),
  dreamClub: z.string().optional(),
  skills: z.string().min(1, "At least one skill is required"),
  achievementsText: z.string().min(1, "Achievements text is required"),
});

const clubFormSchema = z.object({
  name: z.string().min(1, "Club name is required"),
  address: z.string().min(1, "Address is required"),
  foundationDate: z.date({
    required_error: "A foundation date is required.",
  }),
  registrationDate: z.date({
    required_error: "A registration date is required.",
  }),
  contactPerson: z.string().min(1, "Contact person is required"),
  contactMobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  contactEmail: z.string().email("Invalid email address"),
});


function ProfileSkeleton() {
    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    );
}

export default function ProfilePage() {
  const { players, updatePlayer } = usePlayers();
  const { clubs, updateClub } = useClubs();
  const { toast } = useToast();
  const router = useRouter();
  
  const [role, setRole] = useState<'player' | 'recruiter' | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'player' | 'recruiter' | null;
    if (savedRole) {
        setRole(savedRole);
    } else {
        router.push('/login');
    }
  }, [router]);

  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const playerForm = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: "", sport: undefined, age: undefined, location: "", mobile: "",
      height: undefined, weight: undefined, gender: undefined, dreamClub: "",
      skills: "", achievementsText: "",
    },
  });
  
  const clubForm = useForm<z.infer<typeof clubFormSchema>>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: "", address: "", foundationDate: undefined, registrationDate: undefined, contactPerson: "",
      contactMobile: "", contactEmail: "",
    }
  });

  useEffect(() => {
    if (role === 'player' && players.length > 0) {
      const user = players[0];
      setCurrentUser(user);
      playerForm.reset({
        ...user,
        skills: user.skills.join(', '),
      });
      setPerformanceData(user.performanceData || []);
      if (user.achievementsImage) {
        setGeneratedImage(user.achievementsImage);
      }
    }
  }, [role, players, playerForm]);

  useEffect(() => {
    if (role === 'recruiter' && clubs.length > 0) {
      const club = clubs[0];
      setCurrentClub(club);
      clubForm.reset({
        name: club.name,
        address: club.address,
        foundationDate: new Date(club.foundationDate),
        registrationDate: new Date(club.createdAt),
        contactPerson: club.contactPerson,
        contactMobile: club.contactMobile,
        contactEmail: club.contactEmail,
      });
    }
  }, [role, clubs, clubForm]);

  async function onPlayerSubmit(values: z.infer<typeof playerFormSchema>) {
    if (!currentUser) return;

    const achievementImage = generatedImage || referenceImage || currentUser.achievementsImage;

    if (!values.skills.trim()) {
        toast({
            variant: "destructive",
            title: "Skills required",
            description: "At least one skill is required.",
        });
        playerForm.setError("skills", { message: "At least one skill is required" });
        return;
    }

    if (!achievementImage) {
        toast({
            variant: "destructive",
            title: "Achievement image missing",
            description: "Please generate or upload an image for the player's achievements.",
        });
        return;
    }
    
    const updatedPlayer = {
      ...currentUser,
      ...values,
      skills: values.skills.split(",").map((s) => s.trim()),
      achievementsImage: achievementImage,
      performanceData: performanceData,
    };
    
    try {
        await updatePlayer(currentUser.id, updatedPlayer);
        toast({
          title: "Player Profile Updated",
          description: "Your profile has been successfully saved.",
        });
    } catch(e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Error updating profile",
          description: "There was an issue saving your profile.",
        });
    }
  }

  async function onClubSubmit(values: z.infer<typeof clubFormSchema>) {
    if (!currentClub) return;

    const updatedClubData = {
        name: values.name,
        address: values.address,
        foundationDate: format(values.foundationDate, 'yyyy-MM-dd'),
        createdAt: format(values.registrationDate, 'yyyy-MM-dd'),
        contactPerson: values.contactPerson,
        contactMobile: values.contactMobile,
        contactEmail: values.contactEmail,
    };
    
    try {
        await updateClub(currentClub.id, updatedClubData);
        toast({
          title: "Club Profile Updated",
          description: "The club's profile has been successfully saved.",
        });
    } catch(e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Error updating profile",
          description: "There was an issue saving the club's profile.",
        });
    }
  }
  
  const handleAddMetric = () => {
    setPerformanceData([...performanceData, { metric: '', value: 0, unit: '' }]);
  };

  const handleRemoveMetric = (index: number) => {
    const newData = [...performanceData];
    newData.splice(index, 1);
    setPerformanceData(newData);
  };

  const handleMetricChange = (index: number, field: keyof PerformanceMetric, value: string | number) => {
    const newData = [...performanceData];
    (newData[index] as any)[field] = value;
    setPerformanceData(newData);
  };

  if (!role) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight">Profile Management</h1>
                <p className="text-muted-foreground">Manage your {role === 'player' ? 'player' : 'club'} profile.</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
        </div>

        {role === 'player' ? (
          <Tabs defaultValue="player" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
              <TabsTrigger value="player">Player Profile</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="player">
              {!currentUser ? (
                  <ProfileSkeleton />
                ) : (
                  <Card className="max-w-lg mx-auto">
                    <Form {...playerForm}>
                      <form onSubmit={playerForm.handleSubmit(onPlayerSubmit)}>
                        <CardHeader>
                          <CardTitle className="font-headline">Edit Player Profile</CardTitle>
                          <CardDescription>
                            Update your player profile. Click save when you're done.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={playerForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Alex Johnson" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={playerForm.control}
                            name="sport"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sport</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Sport" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {ALL_SPORTS.map(sport => (
                                          <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={playerForm.control}
                              name="age"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Age</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g. 22" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={playerForm.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Male">Male</SelectItem>
                                      <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={playerForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Mumbai, India" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={playerForm.control}
                            name="mobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="e.g. +91 98765 43210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={playerForm.control}
                                name="height"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g. 180" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={playerForm.control}
                                name="weight"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g. 75" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                          </div>
                          <FormField
                            control={playerForm.control}
                            name="dreamClub"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dream Club (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Manchester United" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={playerForm.control}
                            name="skills"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Skills</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dribbling, Passing, Shooting" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter skills separated by commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={playerForm.control}
                            name="achievementsText"
                            render={({ field }) => (
                                <AchievementGenerator
                                    textValue={field.value}
                                    onTextChange={field.onChange}
                                    onImageGenerated={setGeneratedImage}
                                    onReferenceImageSelected={setReferenceImage}
                                />
                            )}
                            />
                        </CardContent>
                        <CardFooter>
                          <Button type="submit">Save Changes</Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                )}
            </TabsContent>
            <TabsContent value="performance">
              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="font-headline">Performance Metrics</CardTitle>
                  <CardDescription>
                    Add or update key performance indicators for your selected sport. This helps clubs benchmark your abilities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {performanceData.map((metric, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <Input 
                        placeholder="Metric Name" 
                        value={metric.metric}
                        onChange={(e) => handleMetricChange(index, 'metric', e.target.value)}
                        className="col-span-5"
                      />
                      <Input 
                        type="number" 
                        placeholder="Value" 
                        value={metric.value}
                        onChange={(e) => handleMetricChange(index, 'value', parseFloat(e.target.value))}
                        className="col-span-3"
                      />
                      <Input 
                        placeholder="Unit" 
                        value={metric.unit}
                        onChange={(e) => handleMetricChange(index, 'unit', e.target.value)}
                        className="col-span-3"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveMetric(index)} className="col-span-1">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddMetric}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Metric
                  </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">This data will be saved with your player profile.</p>
                  </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="club" className="w-full">
            <TabsList className="grid w-full grid-cols-1 max-w-sm mx-auto">
              <TabsTrigger value="club">Club Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="club">
              {!currentClub ? (
                  <ProfileSkeleton />
                ) : (
              <Card className="max-w-xl mx-auto">
                <Form {...clubForm}>
                    <form onSubmit={clubForm.handleSubmit(onClubSubmit)}>
                      <CardHeader>
                        <CardTitle className="font-headline">Edit Club Profile</CardTitle>
                        <CardDescription>
                          Manage your club's profile information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={clubForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name of the Club</FormLabel>
                              <FormControl><Input placeholder="e.g., Mumbai Indians" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={clubForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registered Address</FormLabel>
                              <FormControl><Textarea placeholder="Enter the club's registered address" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={clubForm.control}
                              name="foundationDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Club Foundation Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() || date < new Date("1800-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={clubForm.control}
                              name="registrationDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Date of Registration</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() || date < new Date("1800-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={clubForm.control}
                              name="contactPerson"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Person</FormLabel>
                                  <FormControl><Input placeholder="e.g., Anshul Gupta" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={clubForm.control}
                              name="contactMobile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mobile No.</FormLabel>
                                  <FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </div>
                        <FormField
                          control={clubForm.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl><Input type="email" placeholder="contact@mumbaiindians.com" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="affiliation-docs">Affiliation Documents</Label>
                              <Input id="affiliation-docs" type="file" />
                              <p className="text-xs text-muted-foreground">Upload affiliation proof.</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="club-logo">Club Stamp (or Logo)</Label>
                              <Input id="club-logo" type="file" accept="image/*" />
                              <p className="text-xs text-muted-foreground">Upload the club's official logo.</p>
                            </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit">Save Club Profile</Button>
                      </CardFooter>
                    </form>
                  </Form>
              </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
    </div>
  );
}
