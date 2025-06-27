"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the form schema using Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast('Message sent successfully! I\'ll get back to you soon.', {
          position: 'bottom-right',
          duration: 5000,
        });
        form.reset();
      } else {
        toast(result.error || 'Failed to send message. Please try again.', {
          position: 'bottom-right',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast('Network error. Please check your connection and try again.', {
        position: 'top-right',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                      className="w-full bg-input text-foreground border-border"
                      disabled={isSubmitting}
                    />
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
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Email"
                      {...field}
                      className="w-full bg-input text-foreground border-border"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your Message"
                      {...field}
                      className="w-full h-50 bg-input text-foreground border-border resize-none"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-1/4 hover:underline" disabled={isSubmitting} >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Form>
    </div>
  );
}