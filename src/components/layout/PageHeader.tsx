import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    className?: string;
}

export function PageHeader({ title, subtitle, backgroundImage, className }: PageHeaderProps) {
    return (
        <div className={cn("relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-primary", className)}>
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt={title}
                        fill
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-accent/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/30" />
                </div>
            )}

            {/* Pattern Overlay if no image, or on top of image for texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 mt-20 uppercase tracking-wider">
                        {title}
                    </h1>
                    {subtitle && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-1 bg-primary" />
                            <p className="text-lg text-gray-200 max-w-2xl font-light tracking-wide">
                                {subtitle}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
