// components/MentorExperienceStep.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, AlertCircle } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  availableStartups,
  industryExpertiseOptions,
} from '@/app/types/constant';

export const MentorExperienceStep: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          Professional Experience & Expertise
        </h3>
        <p className="text-blue-700 text-sm">
          Please provide details about your professional background and
          mentoring capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="professionalTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Senior Software Engineer, CEO, Marketing Director"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Professional Experience</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="16-20">16-20 years</SelectItem>
                    <SelectItem value="20+">20+ years</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="industryExpertise"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Areas of Expertise</FormLabel>
              <FormDescription>
                Select all areas where you have significant experience and can
                provide valuable mentorship.
              </FormDescription>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industryExpertiseOptions.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="industryExpertise"
                  render={({ field }) => {
                    const currentValue = field.value || [];
                    return (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={currentValue.includes(item)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...currentValue, item]);
                              } else {
                                field.onChange(
                                  currentValue.filter(
                                    (value: string) => value !== item,
                                  ),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item}
                        </FormLabel>
                      </FormItem>
                    );
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
        name="previousMentoring"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Previous Mentoring Experience</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extensive" id="extensive" />
                  <label htmlFor="extensive">
                    Extensive - I've mentored 5+ individuals/companies
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <label htmlFor="moderate">
                    Moderate - I've mentored 2-4 individuals/companies
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <label htmlFor="limited">
                    Limited - I've mentored 1 individual/company
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <label htmlFor="none">
                    None - This would be my first mentoring experience
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="linkedinProfile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="https://linkedin.com/in/yourprofile"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Your LinkedIn profile helps startups learn more about your
              background.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="resume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Resume/CV</FormLabel>
            <FormControl>
              <Input type="file" accept=".pdf,.doc,.docx" {...field} />
            </FormControl>
            <FormDescription>
              Upload your current resume or CV (PDF, DOC, or DOCX format)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <FormField
        control={form.control}
        name="selectedStartup"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Startup to Mentor</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a startup you'd like to mentor" />
                </SelectTrigger>
                <SelectContent>
                  {availableStartups.map((startup) => (
                    <SelectItem key={startup.id} value={startup.id}>
                      {startup.name} - {startup.stage} ({startup.industry})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Select one startup that matches your expertise and interests.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name="mentorshipApproach"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mentorship Approach</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your mentorship philosophy, approach, and what you hope to achieve with the startup you'll be mentoring. What specific value will you bring to their growth journey?"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Minimum 100 characters. Be specific about your mentoring style and
              value proposition.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability for Mentoring</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <label htmlFor="high">
                    High - I can dedicate 4+ hours per week
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <label htmlFor="moderate">
                    Moderate - I can dedicate 2-3 hours per week
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <label htmlFor="limited">
                    Limited - I can dedicate 1-2 hours per week
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
