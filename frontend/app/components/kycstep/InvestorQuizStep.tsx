// components/InvestorQuizStep.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, AlertCircle } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { quizQuestions } from '@/app/types/constant';

interface InvestorQuizStepProps {
  quizResults: { [key: string]: boolean };
  incorrectAnswers: {
    [key: string]: { userAnswer: string; correctAnswer: string };
  };
}

export const InvestorQuizStep: React.FC<InvestorQuizStepProps> = ({
  quizResults,
  incorrectAnswers,
}) => {
  const form = useFormContext();

  const isQuizPassed = () => {
    return Object.values(quizResults).every((result) => result === true);
  };

  const getIncorrectQuestionsDetails = () => {
    return Object.entries(incorrectAnswers).map(([questionKey, details]) => ({
      question:
        quizQuestions[questionKey as keyof typeof quizQuestions].question,
      userAnswer: details.userAnswer,
      correctAnswer: details.correctAnswer,
      questionKey,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          Startup Investment Risk Assessment
        </h3>
        <p className="text-blue-700 text-sm">
          Please answer the following questions to demonstrate your
          understanding of the risks involved in investing in private, unlisted
          startups.
        </p>
      </div>

      {Object.entries(quizQuestions).map(([questionKey, questionData]) => (
        <FormField
          key={questionKey}
          control={form.control}
          name={questionKey}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                {questionData.question}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-3"
                >
                  {questionData.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-start space-x-3"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${questionKey}-${option.value}`}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`${questionKey}-${option.value}`}
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {Object.keys(quizResults).length > 0 && (
        <div
          className={`p-4 rounded-lg ${isQuizPassed() ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isQuizPassed() ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <h4
              className={`font-semibold ${isQuizPassed() ? 'text-green-800' : 'text-red-800'}`}
            >
              Quiz Results
            </h4>
          </div>
          {isQuizPassed() ? (
            <p className="text-green-700">
              Excellent! You've demonstrated a good understanding of startup
              investment risks.
            </p>
          ) : (
            <div className="text-red-700">
              <p className="mb-2">
                Please review and correct your answers to proceed:
              </p>
              <div className="space-y-4">
                {getIncorrectQuestionsDetails().map(
                  ({ question, userAnswer, correctAnswer, questionKey }) => (
                    <div key={questionKey} className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">
                        {question}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-red-600">
                          <span className="font-medium">Your answer:</span>{' '}
                          {userAnswer}
                        </p>
                        <p className="text-green-600">
                          <span className="font-medium">Correct answer:</span>{' '}
                          {correctAnswer}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
