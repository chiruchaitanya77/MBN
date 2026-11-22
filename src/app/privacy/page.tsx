import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
	title: "Privacy Policy | MBN Construction",
	description:
		"Privacy policy describing how MBN Construction collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<Navbar />

			<main className="flex-1 pt-28 pb-16">
				<section className="container mx-auto max-w-4xl px-4 md:px-6">
					{/* Page Header */}
					<header className="mb-10 border-b border-border pb-6">
						<h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-3">
							Privacy Policy
						</h1>
						<p className="text-sm text-muted-foreground">
							Last updated: {new Date().getFullYear()}
						</p>
					</header>

					<p className="mb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
						Thank you for visiting <span className="font-semibold">MBN Construction</span>.
						We are committed to protecting your privacy. This Privacy Policy explains
						what information we collect, how we use it, and the choices you have.
						We will not collect your personal information when you visit our website
						unless you choose to provide that information to us.
					</p>

					{/* Information Collected */}
					<section className="mb-10">
						<h2 className="mb-3 text-3xl font-heading font-light tracking-wider">
							Information Collected
						</h2>
						<p className="mb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
							If you browse our website or download information, we may automatically
							store the following non-personally identifiable information about your visit:
						</p>
						<ul className="mb-4 list-disc space-y-1 pl-6 text-sm md:text-base text-muted-foreground">
							<li>The page(s) you visit</li>
							<li>The date and time you accessed our website</li>
							<li>The type of device and operating system used</li>
							<li>The type of browser used to access our website</li>
							<li>
								The Internet domain and IP address from which you accessed our website
							</li>
							<li>The search term(s) used in your search engine (if applicable)</li>
						</ul>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							We use this information to understand how visitors use our website and to
							improve our content and user experience. This information does not identify
							you personally.
						</p>
					</section>

					{/* Sending Us Personal Information */}
					<section className="mb-10">
						<h2 className="mb-3 text-3xl font-heading font-light tracking-wider">
							Sending Us Personal Information
						</h2>
						<p className="mb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
							If you choose to submit personal information through our website—such as by
							filling out a contact form, quote request form, or sending us an e-mail—we
							will use that information to:
						</p>
						<ul className="mb-4 list-disc space-y-1 pl-6 text-sm md:text-base text-muted-foreground">
							<li>Respond to your enquiry or request</li>
							<li>Provide project quotations or service information</li>
							<li>Schedule meetings, site visits, or consultations</li>
							<li>Improve our services and customer support</li>
						</ul>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							MBN Construction will not sell, rent, or share your personally identifiable
							information with third parties, except as required by law or with service
							providers who assist us in operating our business and who are bound by
							confidentiality obligations.
						</p>
					</section>

					{/* Cookies & Tracking */}
					<section className="mb-10">
						<h2 className="mb-3 text-3xl font-heading font-light tracking-wider">
							Cookies & Tracking Technologies
						</h2>
						<p className="mb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
							Our website may use cookies or similar technologies to enhance your
							browsing experience, remember your preferences, and collect aggregated
							usage data. You can control cookies through your browser settings and
							choose to block or delete them. However, some features of the site may
							not function properly if cookies are disabled.
						</p>
					</section>

					{/* Your Rights */}
					<section className="mb-10">
						<h2 className="mb-3 text-3xl font-heading font-light tracking-wider">
							Your Rights
						</h2>
						<p className="mb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
							You may have the right to access, update, or request deletion of the
							personal information we hold about you, subject to applicable law. To
							make such a request, please contact us using the details provided below.
						</p>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							We will take reasonable steps to verify your identity before processing
							your request and will respond within a reasonable timeframe.
						</p>
					</section>

					{/* Data Security */}
					<section className="mb-10">
						<h2 className="mb-3 text-3xl font-heading font-light tracking-wider">
							Data Security
						</h2>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							We take reasonable technical and organizational measures to protect your
							information from unauthorized access, loss, misuse, or alteration.
							However, no method of transmission over the internet or electronic storage
							is 100% secure, and we cannot guarantee absolute security.
						</p>
					</section>

					{/* Policy Changes */}
					<section className="mb-10">
						<h2 className="mb-3 text-3xl font-heading font-light tracking-wider">
							Privacy Policy Changes
						</h2>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							We may update this Privacy Policy from time to time to reflect changes in
							our practices, legal requirements, or for other operational reasons. When
							we make changes, we will revise the &quot;Last updated&quot; date at the
							top of this page. We encourage you to review this page periodically to
							stay informed about how we are protecting your information.
						</p>
					</section>

					{/* Contact Details */}
					<section className="mt-8 border-t border-border pt-6">
						<p className="mb-2 text-sm md:text-base text-muted-foreground leading-relaxed">
							If you have any questions about this Privacy Policy or how we handle your
							information, we can be reached via :
							{/*you can contact us at:*/}
						</p>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							<span className="font-semibold">MBN Construction Pvt. Ltd.</span>
							<br />
							Email:{" "}
							<a
								href="mailto:info@mbnconstruction.com"
								className="underline underline-offset-2 hover:text-primary"
							>
								info@mbnconstruction.com
							</a>
							<br />
							Phone:{" "}
							<a
								href="tel:+919999999999"
								className="underline underline-offset-2 hover:text-primary"
							>
								+91-99XX-XXX-XXX
							</a>
						</p>
					</section>
				</section>
			</main>

			<Footer />
		</div>
	);
}
