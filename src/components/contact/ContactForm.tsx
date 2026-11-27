"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { submitContactForm } from "@/app/(public)/contact/actions";
import { COMPANY } from "@/data/company";
import {
  contactFormSchema,
  PROJECT_TYPES,
  BUDGET_RANGES,
  ESTIMATED_TIMELINES,
  type ContactFormData,
} from "@/lib/validations/contact";

const textInputClasses =
  "w-full bg-transparent border-0 border-b border-[#E8E8E8] pb-3 text-[22px] md:text-[28px] text-[#0A0A0A] tracking-[-0.02em] placeholder:text-[#C0C0C0] focus:outline-none focus:border-[#0A0A0A] transition-colors duration-300";

function LargeOptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full text-center rounded-full border px-6 py-3.5 md:py-4 text-[15px] md:text-[16px] font-medium tracking-[-0.01em]",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2",
        selected
          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
          : "bg-transparent text-[#4A4A4A] border-[#DADADA] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
      )}
    >
      {label}
    </button>
  );
}

const TOTAL_STEPS = 4;

export function ContactForm({ initialProjectType }: { initialProjectType?: string } = {}) {
  const revealRef = useReveal<HTMLDivElement>({ threshold: 0.08 });
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: initialProjectType ?? "",
      timeline: "",
      message: "",
      company_website: "",
    },
  });

  const projectType = watch("projectType");
  const budget = watch("budget");
  const timeline = watch("timeline");

  // Smooth step transition logic
  const changeStep = async (newStep: number) => {
    if (newStep > step) {
      // Validate current step before proceeding
      const fieldsToValidate: (keyof ContactFormData)[] =
        step === 1 ? ["projectType"] : step === 2 ? ["timeline", "budget"] : step === 3 ? ["message"] : [];

      const isStepValid = await trigger(fieldsToValidate);
      if (!isStepValid) return;
    }

    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 250); // Matches CSS transition duration
  };

  const validateAndSetFile = (file: File) => {
    setAttachmentError(null);
    if (file.size > 4 * 1024 * 1024) {
      setAttachmentError("The attached file exceeds the maximum 4 MB size limit.");
      return;
    }
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [".pdf", ".docx", ".zip", ".png", ".jpg", ".jpeg"];
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!isValid) {
      setAttachmentError("Unsupported file format. Please upload PDF, DOCX, ZIP, PNG, JPG, or JPEG.");
      return;
    }
    setAttachment(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const onSubmit = (data: ContactFormData) => {
    setServerError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    if (attachment) {
      formData.append("attachment", attachment);
    }

    startTransition(async () => {
      let result: Awaited<ReturnType<typeof submitContactForm>>;
      try {
        result = await submitContactForm({ status: "idle" }, formData);
      } catch {
        // Network failure, an oversized request or a server crash: the
        // enquiry never arrived, so say so and offer a direct route.
        setServerError(`Sorry — we couldn't send your message. Please try again, or email us at ${COMPANY.email}.`);
        return;
      }
      if (result.status === "success") {
        setSubmitted(true);
        setAttachment(null);
        reset();
        setStep(1);
      } else if (result.status === "error") {
        setServerError(result.message);
      }
    });
  };

  if (submitted) {
    return (
      <section className="py-24 md:py-32 bg-white" aria-live="polite">
        <Container>
          <div className="flex flex-col items-center text-center gap-6 max-w-[520px] mx-auto py-16 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0A0A0A]">
              <Check size={26} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="font-semibold tracking-tight text-3xl md:text-[36px] text-[#0A0A0A]">
              Message sent.
            </h2>
            <p className="text-[16px] text-[#6B6B6B] leading-[1.7]">
              Thanks for reaching out — we read every message ourselves and
              reply within one working day.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="mt-6 rounded-full px-8"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 bg-white" aria-labelledby="contact-form-heading">
      <Container>
        <div ref={revealRef} className="max-w-[720px] mx-auto">
          <h2 id="contact-form-heading" className="sr-only">
            Send us a message
          </h2>

          {/* Progress Indicator */}
          <p className="sr-only" aria-live="polite">
            Step {step} of {TOTAL_STEPS}
          </p>
          <div className="flex flex-col items-center gap-3 mb-14 md:mb-16" aria-hidden="true">
            <span className="text-[12px] tracking-[0.14em] uppercase text-[#8A8A8A] tabular-nums">
              Step {step} / {TOTAL_STEPS}
            </span>
            <div className="flex items-center gap-2 md:gap-4">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-4">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors duration-300",
                      step >= i + 1 ? "bg-[#0A0A0A]" : "bg-[#E8E8E8]"
                    )}
                  />
                  {i < TOTAL_STEPS - 1 && (
                    <div
                      className={cn(
                        "w-8 md:w-16 h-[2px] transition-colors duration-300",
                        step > i + 1 ? "bg-[#0A0A0A]" : "bg-[#E8E8E8]"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div
              className={cn(
                "transition-all duration-250 ease-in-out",
                animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              )}
            >
              {/* STEP 1: PROJECT TYPE */}
              {step === 1 && (
                <div className="flex flex-col gap-10">
                  <div className="text-center mb-2">
                    <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0A0A0A] mb-4">
                      What are you building?
                    </h3>
                    <p className="text-[#6B6B6B] text-[16px] md:text-[18px]">Pick the closest fit — you can add detail later.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[640px] mx-auto w-full" role="group" aria-label="Project type">
                    {PROJECT_TYPES.map((type) => (
                      <LargeOptionButton
                        key={type}
                        label={type}
                        selected={projectType === type}
                        onClick={() => {
                          setValue("projectType", type, { shouldValidate: true });
                          setTimeout(() => changeStep(2), 300);
                        }}
                      />
                    ))}
                  </div>
                  {errors.projectType && (
                    <p className="text-[15px] text-[#B3261E] text-center mt-2 font-medium">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>
              )}

              {/* STEP 2: TIMELINE & BUDGET */}
              {step === 2 && (
                <div className="flex flex-col gap-12">
                  <div className="text-center">
                    <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0A0A0A] mb-4">
                      What are the constraints?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                    {/* Timeline */}
                    <div className="flex flex-col gap-6">
                      <span className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#6B6B6B] text-center">
                        Estimated Timeline
                      </span>
                      <div className="flex flex-col gap-3" role="group" aria-label="Project timeline">
                        {ESTIMATED_TIMELINES.map((time) => (
                          <LargeOptionButton
                            key={time}
                            label={time}
                            selected={timeline === time}
                            onClick={() => setValue("timeline", time, { shouldValidate: true })}
                          />
                        ))}
                      </div>
                      {errors.timeline && (
                        <p className="text-[14px] text-[#B3261E] text-center">
                          {errors.timeline.message}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div className="flex flex-col gap-6">
                      <span className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#6B6B6B] text-center">
                        Estimated Budget <span className="normal-case text-[#C0C0C0] font-medium">(optional)</span>
                      </span>
                      <div className="flex flex-col gap-3" role="group" aria-label="Project budget">
                        {BUDGET_RANGES.map((range) => (
                          <LargeOptionButton
                            key={range}
                            label={range}
                            selected={budget === range}
                            onClick={() =>
                              setValue("budget", budget === range ? undefined : range, {
                                shouldValidate: true,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MESSAGE & ATTACHMENT */}
              {step === 3 && (
                <div className="flex flex-col gap-10">
                  <div className="text-center">
                    <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0A0A0A] mb-4">
                      Tell us about it
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label htmlFor="message" className="sr-only">
                      Project details
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="What are you trying to build, and what does success look like?"
                      aria-invalid={!!errors.message}
                      className={cn(textInputClasses, "resize-none border border-[#E8E8E8] rounded-2xl p-6 bg-[#FAFAFA] focus:bg-white text-[18px] md:text-[20px]")}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-[15px] font-medium text-[#B3261E]">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Attachment Area */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#6B6B6B]">
                      Attachment <span className="normal-case text-[#C0C0C0] font-medium">(optional)</span>
                    </span>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-[16px] p-8 text-center transition-all duration-300 relative cursor-pointer",
                        dragActive ? "border-[#0A0A0A] bg-[#0A0A0A]/5" : "border-[#E8E8E8] hover:border-[#6B6B6B]",
                        attachment ? "border-solid border-[#0A0A0A]/10 bg-[#FAFAFA]" : ""
                      )}
                    >
                      <input
                        type="file"
                        aria-label="Attach a file (optional)"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />

                      {attachment ? (
                        <div className="flex items-center justify-between gap-4 pointer-events-auto">
                          <div className="flex flex-col items-start text-left min-w-0">
                            <span className="text-[16px] font-medium text-[#0A0A0A] truncate max-w-[260px] sm:max-w-[450px]">
                              {attachment.name}
                            </span>
                            <span className="text-[14px] text-[#6B6B6B]">
                              {formatFileSize(attachment.size)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAttachment(null);
                            }}
                            className="text-[14px] font-medium text-[#B3261E] hover:underline cursor-pointer px-2"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <p className="text-[16px] text-[#0A0A0A] font-medium">
                            Drag and drop your file here, or <span className="underline">browse</span>
                          </p>
                          <p className="text-[14px] text-[#6B6B6B]">
                            Share a brief, wireframe, reference, or project document. Max 4 MB.
                          </p>
                        </div>
                      )}
                    </div>
                    {attachmentError && (
                      <p className="text-[15px] font-medium text-[#B3261E]">
                        {attachmentError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT DETAILS */}
              {step === 4 && (
                <div className="flex flex-col gap-12">
                  <div className="text-center">
                    <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0A0A0A] mb-4">
                      Who are we talking to?
                    </h3>
                  </div>

                  <div className="flex flex-col gap-10 max-w-[500px] mx-auto w-full">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-name" className="eyebrow">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your full name"
                        aria-invalid={!!errors.name}
                        className={textInputClasses}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-[15px] font-medium text-[#B3261E]">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-email" className="eyebrow">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        aria-invalid={!!errors.email}
                        className={textInputClasses}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-[15px] font-medium text-[#B3261E]">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <label htmlFor="contact-company" className="eyebrow">
                        Company <span className="normal-case tracking-normal text-[#A0A0A0]">(optional)</span>
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Company or brand name"
                        className={textInputClasses}
                        {...register("company")}
                      />
                    </div>
                  </div>
                  
                  {/* Honeypot */}
                  <input type="hidden" {...register("projectType")} value={projectType ?? ""} />
                  <input type="hidden" {...register("timeline")} value={timeline ?? ""} />
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                    value=""
                    {...register("company_website")}
                  />

                  {serverError && (
                    <div className="mt-8 p-4 bg-[#FFF5F5] rounded-xl text-center">
                      <p role="alert" className="text-[15px] text-[#B3261E] font-medium">
                        {serverError}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t border-[#E8E8E8]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => changeStep(step - 1)}
                  className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors font-medium text-[16px] py-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              ) : (
                <div /> // Spacer
              )}

              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="rounded-full px-8 text-[16px]"
                  onClick={() => changeStep(step + 1)}
                >
                  Continue
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isPending}
                  className="rounded-full px-10 text-[16px]"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}