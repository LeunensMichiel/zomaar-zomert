"use client";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { ChevronRight, MailCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  naam: string;
  email: string;
  telefoon?: string;
  onderwerp: string;
  bericht: string;
};

const FORM_NAME = "contactformulier";

function encodeForm(values: FormValues) {
  const params = new URLSearchParams({ "form-name": FORM_NAME });
  for (const [key, value] of Object.entries(values)) {
    params.set(key, value);
  }
  return params.toString();
}

export function Form() {
  const t = useTranslations("contact");
  const reduceMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitted(false);
    setIsSubmitting(true);
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(values),
      });
      if (!response.ok)
        throw new Error(`Form submit failed: ${response.status}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  if (isSubmitted) {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="shadow-sticker flex flex-col items-center gap-5 border-2 border-gray-900 bg-pink-50 px-6 py-12 text-center"
      >
        <motion.span
          initial={reduceMotion ? false : { rotate: -8, scale: 0.6 }}
          animate={{ rotate: -4, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 16,
            delay: 0.1,
          }}
          className="shadow-sticker-sm flex size-16 items-center justify-center border-2 border-gray-900 bg-gray-900 text-white md:size-20"
        >
          <MailCheck className="size-8 md:size-10" strokeWidth={2.25} />
        </motion.span>
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {t("form.successTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-base text-gray-700">
            {t("form.success")}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      className="grid items-start gap-4"
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit(onSubmit)}
      {...{ "netlify-honeypot": "bot-field" }}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <label className="hidden" aria-hidden="true">
        Don&apos;t fill this out if you&apos;re human:
        <input name="bot-field" tabIndex={-1} />
      </label>
      <Input
        label={t("form.name.label")}
        type="text"
        placeholder={t("form.name.placeholder")}
        error={errors.naam}
        {...register("naam", { required: t("form.name.error") })}
      />
      <Input
        label={t("form.email.label")}
        type="email"
        placeholder={t("form.email.placeholder")}
        error={errors.email}
        {...register("email", { required: t("form.email.error") })}
      />
      <Input
        label={t("form.phone.label")}
        type="tel"
        placeholder="+32 4XX XX XX XX"
        {...register("telefoon")}
      />
      <Input
        label={t("form.subject.label")}
        type="text"
        placeholder={t("form.subject.placeholder")}
        error={errors.onderwerp}
        {...register("onderwerp", { required: t("form.subject.error") })}
      />
      <Textarea
        label={t("form.message.label")}
        placeholder={t("form.message.placeholder")}
        error={errors.bericht}
        {...register("bericht", { required: t("form.message.error") })}
      />
      <Button
        type="submit"
        size="lg"
        variant="brand"
        sticker
        iconRight={<ChevronRight />}
        loading={isSubmitting}
        className="mt-2 md:justify-self-start"
      >
        {t("form.button")}
      </Button>
    </form>
  );
}
