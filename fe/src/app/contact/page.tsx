import React from "react";
import ContactForm from "../../components/ui/ContactForm";

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-16 items-center justify-center pt-16 pb-68 lg:pb-40 bg-gradient-to-t from-background via-accent-foreground to-background">
      <p className="text-2xl lg:text-3xl font-bold text-primary w-full lg:w-fit text-center">
        LIÊN HỆ
      </p>
      <ContactForm />
    </div>
  );
}
