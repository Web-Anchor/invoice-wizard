'use client';

import Button from '@app/components/Button';
import FrequentlyAskedQuestions from '@app/components/FrequentlyAskedQuestions';
import PageHeadings from '@app/components/PageHeadings';
import Select from '@app/components/Select';
import TestimonialsWhiteGrid from '@app/components/TestimonialsWhiteGrid';
import Wrapper from '@app/components/Wrapper';
import { maxLength } from '@config/index';
import { cFetch } from '@lib/cFetcher';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const [state, setState] = useState<{ fetching?: boolean }>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(form: any) {
    try {
      // --------------------------------------------------------------------------------
      // 📌  Add Stripe API key to db
      // --------------------------------------------------------------------------------
      setState((prev) => ({ ...prev, fetching: true }));
      const subject = form.get('subject');
      const message = form.get('message');
      const email = form.get('email-address');

      // if no subject return error
      if (!subject) {
        throw new Error('Subject is required');
      }

      const { data, status } = await cFetch({
        url: '/api/v1/support/add-ticket-public',
        method: 'POST',
        data: { subject, message, email },
      });

      console.log('🔑 data', data, status);

      if (status !== 200 || data?.error) {
        throw new Error(data?.error);
      }

      toast.success(
        'Your message has been received. We will get back to you shortly.'
      );
      formRef.current?.reset(); // Reset form ref after successful submission
    } catch (error: any) {
      const isValidMsg = !!error.message.length;
      console.error(error.message);
      toast.error(
        isValidMsg
          ? error.message
          : 'An error occurred. Please try again later.'
      );
    } finally {
      setState((prev) => ({ ...prev, fetching: false }));
    }
  }

  function formHandler(e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) {
    e.preventDefault();
    submit(new FormData(e.currentTarget));
  }

  return (
    <Wrapper class="mx-auto max-w-3xl">
      <PageHeadings
        title="Contact Us."
        description="Welcome to our contact page! We are here to assist you with any inquiries or support you may need regarding our platform for managing customer invoicing. Please feel free to reach out to us using the information provided below."
      />

      <form
        ref={formRef}
        className="card max-w-4xl lg:px-10 lg:py-8 bg-base-100 lg:shadow-xl"
        onSubmit={formHandler}
      >
        <div className="space-y-12">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex flex-col gap-5 flex-1">
              <Select
                label="Reason for contacting"
                name="subject"
                data={[
                  // 'General Inquiry',
                  // 'Technical Support',
                  // 'Billing Inquiry',
                  // 'Feature Request',
                  // 'Other',
                  { key: 1, value: 'General Inquiry' },
                  { key: 2, value: 'Technical Support' },
                  { key: 3, value: 'Billing Inquiry' },
                  { key: 4, value: 'Feature Request' },
                  { key: 5, value: 'Other' },
                ]}
                required
              />

              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-800"
                >
                  Describe subject for contacting{' '}
                  <span className="text-xs text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-5 mt-2">
                  <textarea
                    rows={5}
                    name="message"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your message"
                    defaultValue={''}
                    maxLength={maxLength?.comment}
                    required
                  />
                </div>
                <p className="mt-3 text-xs leading-6 text-gray-600">
                  Please provide as much detail as possible so we can assist you
                  better.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button fetching={state?.fetching} type="submit">
            Submit
          </Button>
        </div>
      </form>

      <FrequentlyAskedQuestions />
      <TestimonialsWhiteGrid />
    </Wrapper>
  );
}
