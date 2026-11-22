import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
// import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Calculator, Building2, Ruler } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import quoteBg from "@assets/generated_images/construction_cost_estimation_and_planning.png";

const formSchema = z.object({
  // Personal Details
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  company: z.string().optional(),

  // Project Details
  projectType: z.enum(["residential", "commercial", "industrial", "renovation", "other"], {
    required_error: "Please select a project type",
  }),
  plotSize: z.string().min(1, "Plot size is required (e.g. 2400 sqft)"),
  location: z.string().min(2, "Project location is required"),
  budget: z.string().optional(),
  timeline: z.date().optional(),

  // Specifics
  services: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Select at least one service",
  }),
  description: z.string().min(10, "Please provide some details about your project"),
});

export default function QuotePage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Quote Request Received",
      description: "We have received your project details. Our team will analyze your requirements and contact you within 24 hours with a preliminary estimate.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Get a Quote"
        subtitle="Start Your Journey with a Professional Cost Estimate"
        backgroundImage={quoteBg}
      />

      <main className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column: Benefits/Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-primary text-white p-8 shadow-xl">
                <h3 className="text-2xl font-heading font-bold mb-4">Why Choose MBN?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  We provide transparent, detailed estimations with no hidden costs. Our engineering background ensures accurate material and structural planning from day one.
                </p>
                <ul className="space-y-4">
                  {[
                    "Detailed Material Breakdown",
                    "Structural Integrity Guarantee",
                    "Transparent Labor Costs",
                    "Fixed Timeline Commitment",
                    "Regulatory Compliance Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-4 mb-4 text-primary">
                  <Calculator className="w-8 h-8" />
                  <h3 className="text-xl font-heading font-bold">Estimation Process</h3>
                </div>
                <div className="space-y-6 relative">
                  <div className="absolute left-3.5 top-3 bottom-0 w-0.5 bg-gray-100" />
                  {[
                    { title: "Submission", desc: "You submit project details" },
                    { title: "Analysis", desc: "Our engineers review requirements" },
                    { title: "Site Visit", desc: "We inspect the location (if needed)" },
                    { title: "Proposal", desc: "You receive a detailed quote" },
                  ].map((step, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-accent flex items-center justify-center shrink-0 z-10 text-xs font-bold text-accent">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{step.title}</h4>
                        <p className="text-xs text-gray-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-xl">
                <CardContent className="p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-heading font-bold text-primary mb-2">Project Details Form</h2>
                    <p className="text-gray-500">Please fill out the details below. The more information you provide, the more accurate our initial estimate will be.</p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                      {/* Section 1: Client Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-accent uppercase tracking-wider border-b border-gray-100 pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your name" {...field} className="bg-gray-50 border-gray-200" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. MBN Realty" {...field} className="bg-gray-50 border-gray-200" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" {...field} className="bg-gray-50 border-gray-200" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 99483..." {...field} className="bg-gray-50 border-gray-200" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Section 2: Project Specifics */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-accent uppercase tracking-wider border-b border-gray-100 pb-2">Project Requirements</h3>

                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Project Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                >
                                  {["residential", "commercial", "industrial", "renovation", "other"].map((type) => (
                                    <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value={type} id={type} className="peer sr-only" />
                                      </FormControl>
                                      <FormLabel
                                        htmlFor={type}
                                        className="flex flex-col items-center justify-center w-full p-4 border-2 rounded-md border-gray-200 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 hover:bg-gray-50 cursor-pointer transition-all"
                                      >
                                        <span className="capitalize font-bold text-gray-700 peer-data-[state=checked]:text-accent">{type}</span>
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <FormField
                            control={form.control}
                            name="plotSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plot/Area Size</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input placeholder="e.g. 2400 sqft" {...field} className="pl-10 bg-gray-50 border-gray-200" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Location</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input placeholder="City/Area name" {...field} className="pl-10 bg-gray-50 border-gray-200" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estimated Budget (Approx)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                      <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="under-20l">Under 20 Lakhs</SelectItem>
                                    <SelectItem value="20l-50l">20L - 50L</SelectItem>
                                    <SelectItem value="50l-1cr">50L - 1 Cr</SelectItem>
                                    <SelectItem value="1cr-plus">1 Cr+</SelectItem>
                                    <SelectItem value="undecided">Not sure yet</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Target Start Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal bg-gray-50 border-gray-200",
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
                                        date < new Date()
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

                        <FormField
                          control={form.control}
                          name="services"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">Services Required</FormLabel>
                                <FormDescription>
                                  Select all that apply to your project.
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[
                                  { id: "construction", label: "Full Construction" },
                                  { id: "planning", label: "Architectural Planning" },
                                  { id: "structural", label: "Structural Design" },
                                  { id: "renovation", label: "Renovation" },
                                  { id: "interior", label: "Interior Finishing" },
                                  { id: "consultation", label: "General Consultation" },
                                ].map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="services"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(item.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, item.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== item.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-gray-700 cursor-pointer">
                                            {item.label}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe your project vision, specific requirements, or any questions you have..."
                                  className="min-h-[120px] bg-gray-50 border-gray-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="w-full md:w-auto px-8 h-12 bg-accent hover:bg-accent/90 text-white font-heading uppercase tracking-wider text-lg rounded-none">
                          Submit Quote Request
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
