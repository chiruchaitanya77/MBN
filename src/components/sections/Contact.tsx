// "use client";
//
// import { useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useToast } from "@/hooks/use-toast";
// import { Phone, Mail, MapPin, Building } from "lucide-react";
//
// const formSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(10, "Valid phone number required"),
//   message: z.string().min(10, "Message must be at least 10 characters"),
// });
//
// export function Contact() {
//   const { toast } = useToast();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       message: "",
//     },
//   });
//
//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//     toast({
//       title: "Message Sent!",
//       description: "We'll get back to you shortly.",
//       className: "text-white bg-accent border-primary",
//     });
//     form.reset();
//   }
//
//   return (
//     <section id="contact" className="py-24 bg-background relative">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//
//           {/* Contact Info */}
//           <div className="space-y-10">
//             <div>
//               <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase mb-4">
//                 Get In Touch
//               </h2>
//               <p className="text-lg text-muted-foreground">
//                 Ready to start your project? Contact us for a consultation and quote.
//                 We deliver quality construction on time and within budget.
//               </p>
//             </div>
//
//             <div className="space-y-6">
//               <div className="flex items-start gap-4 group">
//                 <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300">
//                   <Phone className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
//                 </div>
//                 <div>
//                   <h4 className="font-heading font-bold text-lg">Call Us</h4>
//                   <a href="tel:9948314455" className="text-muted-foreground hover:text-primary transition-colors text-lg">
//                     9948314455
//                   </a>
//                 </div>
//               </div>
//
//               <div className="flex items-start gap-4 group">
//                 <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300">
//                   <Mail className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
//                 </div>
//                 <div>
//                   <h4 className="font-heading font-bold text-lg">Email Us</h4>
//                   <a href="mailto:mbnaik1987@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-lg">
//                     mbnaik1987@gmail.com
//                   </a>
//                 </div>
//               </div>
//
//               <div className="flex items-start gap-4 group">
//                 <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300">
//                   <MapPin className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
//                 </div>
//                 <div>
//                   <h4 className="font-heading font-bold text-lg">Visit Us</h4>
//                   <p className="text-muted-foreground">
//                     Thukkuguda, Srisailam Highway,<br/>
//                     Mandal Maheshwaram, R.R.Dist - 501359
//                   </p>
//                 </div>
//               </div>
//
//               <div className="p-6 bg-secondary/30 border-l-4 border-primary">
//                  <h4 className="font-heading font-bold text-lg mb-2">Business Information</h4>
//                  <p className="text-sm text-muted-foreground font-mono">PAN: BFPPM5518C</p>
//               </div>
//             </div>
//           </div>
//
//           {/* Contact Form */}
//           <div className="bg-card shadow-xl p-8 md:p-10 border border-border/50">
//             <h3 className="text-2xl font-heading font-bold mb-6">Send a Message</h3>
//
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Your Name" {...field} className="rounded-none h-12 bg-secondary/20 border-border" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input placeholder="email@example.com" {...field} className="rounded-none h-12 bg-secondary/20 border-border" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="phone"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Phone</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Mobile Number" {...field} className="rounded-none h-12 bg-secondary/20 border-border" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//
//                 <FormField
//                   control={form.control}
//                   name="message"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Message</FormLabel>
//                       <FormControl>
//                         <Textarea placeholder="Tell us about your project..." className="min-h-[120px] rounded-none bg-secondary/20 border-border resize-none" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//
//                 <Button type="submit" className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 text-white font-heading tracking-wider uppercase text-lg">
//                   Send Message
//                 </Button>
//               </form>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useToast} from "@/hooks/use-toast";
import {Phone, Mail, MapPin, Loader2} from "lucide-react";
import UnderlineOnHover from "../ui/underline-hover";
import SendingLoader from "@/components/ui/sending-animation";


const formSchema = z.object( {
	name: z.string().min( 2, "Name is required" ),
	email: z.string().email( "Invalid email address" ),
	phone: z.string().min( 10, "Valid phone number required" ),
	message: z.string().min( 10, "Message must be at least 10 characters" ),
} );

export function Contact() {
	const {toast} = useToast();
	const [isSubmitting, setIsSubmitting] = useState( false );

	const form = useForm<z.infer<typeof formSchema>>( {
		resolver: zodResolver( formSchema ),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			message: "",
		},
	} );

	async function onSubmit( values: z.infer<typeof formSchema> ) {
		setIsSubmitting( true );

		try {
			const response = await fetch( "/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify( values ),
			} );

			const data = await response.json();

			if (!response.ok) {
				throw new Error( data.error || "Something went wrong" );
			}

			toast( {
				title: "Message Sent Successfully! ✓",
				description: "We'll get back to you shortly. Check your email for confirmation.",
				className: "text-white bg-green-600 border-green-700",
			} );

			form.reset();
		} catch (error) {
			console.error( "Form submission error:", error );
			toast( {
				title: "Submission Failed",
				description: error instanceof Error ? error.message : "Please try again later or call us directly.",
				variant: "destructive",
			} );
		} finally {
			setIsSubmitting( false );
		}
	}

	return (
		<section id="contact" className="py-24 bg-background relative">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

					{/* Contact Info */}
					<div className="space-y-10">
						<div>
							<h2 className="text-4xl md:text-5xl font-heading font-bold uppercase mb-4">
								Get In Touch
							</h2>
							<p className="text-lg text-muted-foreground">
								Ready to start your project? Contact us for a consultation and quote.
								We deliver quality construction on time and within budget.
							</p>
						</div>

						<div className="space-y-6">
							<div className="flex items-start gap-4 group w-fit">
								<div
									className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300">
									<Phone className="w-6 h-6 text-primary group-hover:text-white transition-colors"/>
								</div>
								<div>
									<h4 className="font-heading font-bold text-lg">Call Us</h4>
									<UnderlineOnHover>
										<a href="tel:9948314455"
										   className="text-muted-foreground hover:text-primary transition-colors text-lg underline underline-offset-4 decoration-black/20">
											9948314455
										</a>
									</UnderlineOnHover>
								</div>
							</div>

							<div className="flex items-start gap-4 group w-fit">
								<div
									className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300">
									<Mail className="w-6 h-6 text-primary group-hover:text-white transition-colors"/>
								</div>
								<div>
									<h4 className="font-heading font-bold text-lg">Email Us</h4>
									<UnderlineOnHover>
										<a href="mailto:mbnaik1987@gmail.com"
										   className="text-muted-foreground hover:text-primary transition-colors text-lg underline underline-offset-4 decoration-black/20">
											mbnaik1987@gmail.com
										</a>
									</UnderlineOnHover>
								</div>
							</div>

							<div className="flex items-start gap-4 group w-fit">
								<div
									className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-300">
									<MapPin className="w-6 h-6 text-primary group-hover:text-white transition-colors"/>
								</div>
								<div>
									<h4 className="font-heading font-bold text-lg">Visit Us</h4>
									<p className="text-muted-foreground">
										Thukkuguda, Srisailam Highway,<br/>
										Mandal Maheshwaram, R.R.Dist - 501359
									</p>
								</div>
							</div>

							<div className="p-6 bg-secondary/30 border-l-4 border-primary">
								<h4 className="font-heading font-bold text-lg mb-2">Business Information</h4>
								<p className="text-sm text-muted-foreground font-mono">PAN: BFPPM5518C</p>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div className="bg-card shadow-xl p-8 md:p-10 border border-border/50">
						<h3 className="text-2xl font-heading font-bold mb-6">Send a Message</h3>

						<Form {...form}>
							<form onSubmit={form.handleSubmit( onSubmit )} className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={( {field} ) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Your Name"
													{...field}
													disabled={isSubmitting}
													className="rounded-none h-12 bg-secondary/20 border-border"
												/>
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="email"
										render={( {field} ) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder="email@example.com"
														{...field}
														disabled={isSubmitting}
														className="rounded-none h-12 bg-secondary/20 border-border"
													/>
												</FormControl>
												<FormMessage/>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phone"
										render={( {field} ) => (
											<FormItem>
												<FormLabel>Phone</FormLabel>
												<FormControl>
													<Input
														placeholder="Mobile Number"
														{...field}
														disabled={isSubmitting}
														className="rounded-none h-12 bg-secondary/20 border-border"
													/>
												</FormControl>
												<FormMessage/>
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="message"
									render={( {field} ) => (
										<FormItem>
											<FormLabel>Message</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Tell us about your project..."
													className="min-h-[120px] rounded-none bg-secondary/20 border-border resize-none"
													disabled={isSubmitting}
													{...field}
												/>
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>

								{/*<Button*/}
								{/*	type="submit"*/}
								{/*	disabled={isSubmitting}*/}
								{/*	className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 text-white font-heading tracking-wider uppercase text-lg disabled:opacity-50"*/}
								{/*>*/}
								{/*	{isSubmitting ? (*/}
								{/*		<>*/}
								{/*			<Loader2 className="mr-2 h-5 w-5 animate-spin"/>*/}
								{/*			Sending...*/}
								{/*		</>*/}
								{/*	) : (*/}
								{/*		"Send Message"*/}
								{/*	)}*/}
								{/*</Button>*/}
								<Button type="submit" disabled={isSubmitting}
								        className="group relative w-full h-12 rounded-none bg-primary text-white font-heading tracking-wider overflow-visible uppercase text-lg disabled:opacity-50 disabled:pointer-events-none transition-transform duration-200 active:scale-95 hover:cursor-pointer">
									{/* Content */}
									<span
										className="relative z-10 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:translate-x-20">
					                    {isSubmitting ? (
						                    <>
							                    <SendingLoader/>
							                    {/*<Loader2 className="mr-2 h-5 w-5 animate-spin"/>*/}
							                    &nbsp;&nbsp;&nbsp;Sending...
						                    </>
					                    ) : (
						                    "Send Message"
					                    )}
					                  </span>
									{/* Flying Icon */}
									{isSubmitting ? (
										<span className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:translate-x-32 group-hover:rotate-45 group-hover:scale-110 animate-none group-hover:animate-[fly_0.6s_ease-in-out_infinite_alternate]">
											<Loader2 className="mr-2 h-12 w-12 animate-spin"/>
										</span>
									) : (
										<span
											className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:translate-x-32 group-hover:rotate-45 group-hover:scale-110 animate-none group-hover:animate-[fly_0.6s_ease-in-out_infinite_alternate]">
					                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					                      <path fill="none" d="M0 0h24v24H0z"/>
					                      <path fill="currentColor"
					                            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/>
					                    </svg>
									</span>
									)}
								</Button>

							</form>
						</Form>
					</div>
				</div>
			</div>
		</section>
	);
}
