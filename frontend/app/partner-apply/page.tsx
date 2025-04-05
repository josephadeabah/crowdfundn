"use-client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { useToast } from '@/app/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, Users, Combine, Info } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid website URL'),
  organization: z.string().min(2, 'Organization name is required'),
  description: z
    .string()
    .min(20, 'Please provide a detailed description (min 20 characters)'),
  audienceSize: z.string().min(1, 'Please specify your audience size'),
  socialProfiles: z.string().optional(),
  previousProjects: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PartnerApply = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      website: '',
      organization: '',
      description: '',
      audienceSize: '',
      socialProfiles: '',
      previousProjects: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast({
      title: 'Application Submitted',
      description:
        "Thank you! We'll review your application and get back to you soon.",
    });

    // Redirect after submission
    setTimeout(() => {
      router.push('/partner-program');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
                Partner Program Application
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our network of verified partners and help campaigns reach
              their goals while growing your audience.
            </p>
          </div>

          <Card className="p-6 md:p-8 shadow-lg border-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
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
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization/Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Ltd" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourcompany.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell us about your organization</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your organization, expertise, and how you can help campaigns succeed..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audienceSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audience Size</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., 10,000 newsletter subscribers, 50,000 social followers"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about your audience reach across all
                        channels
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialProfiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Profiles</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LinkedIn, Twitter, Instagram URLs (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousProjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Campaign Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share examples of campaigns you've helped promote or any relevant experience..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 text-center">
                  <Button
                    type="submit"
                    className="bg-fundify-primary hover:bg-fundify-primary/90 text-white px-8 py-6 h-auto text-lg"
                  >
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </Card>

          <div className="mt-8 p-6 bg-fundify-muted rounded-lg">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2 text-fundify-primary" />
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
                  <Combine className="h-7 w-7 text-fundify-primary" />
                </div>
                <h4 className="font-medium mb-2">Application Review</h4>
                <p className="text-sm text-gray-600">
                  We'll review your application within 3-5 business days
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
                  <Users className="h-7 w-7 text-fundify-primary" />
                </div>
                <h4 className="font-medium mb-2">Partner Interview</h4>
                <p className="text-sm text-gray-600">
                  A brief call to discuss partnership details and expectations
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
                  <BadgeCheck className="h-7 w-7 text-fundify-primary" />
                </div>
                <h4 className="font-medium mb-2">Welcome Aboard</h4>
                <p className="text-sm text-gray-600">
                  If approved, you'll receive your partner profile and
                  onboarding kit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerApply;
