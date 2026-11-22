"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { localeConfig } from "@/config/locale";
import {
  DESCRIPTION_MAX_LENGTH,
  validateTransactionForm,
  type TransactionFormErrors,
  type TransactionFormField,
  type TransactionFormValues,
  type ValidatedTransactionInput,
} from "@/lib/finance/transaction-form";
import type { Category, IsoDate, TransactionType } from "@/types/finance";

const currencySymbol = new Intl.NumberFormat(localeConfig.locale, { style: "currency", currency: localeConfig.currency })
  .formatToParts(0)
  .find((part) => part.type === "currency")?.value;

const copy: Record<TransactionType, { amountHint: string; descriptionPlaceholder: string; submit: string }> = {
  expense: { amountHint: "How much did you spend?", descriptionPlaceholder: "e.g. Weekly groceries", submit: "expense" },
  income: { amountHint: "How much did you receive?", descriptionPlaceholder: "e.g. November salary", submit: "income" },
};

interface TransactionFormProps {
  initialValues: TransactionFormValues;
  categories: Category[];
  today: IsoDate;
  mode: "add" | "edit";
  onSubmit: (value: ValidatedTransactionInput) => void;
  onCancel: () => void;
}

export function TransactionForm({ initialValues, categories, today, mode, onSubmit, onCancel }: TransactionFormProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<TransactionFormErrors>({});

  const typeCategories = categories.filter((category) => category.type === values.type);
  const text = copy[values.type];

  function update<K extends keyof TransactionFormValues>(key: K, value: TransactionFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function changeType(type: TransactionType) {
    setValues((current) => ({ ...current, type, categoryId: "" }));
    setErrors((current) => ({ ...current, categoryId: undefined }));
  }

  function focusFirstInvalid(next: TransactionFormErrors) {
    const order: TransactionFormField[] = ["amount", "categoryId", "date", "description"];
    const first = order.find((field) => next[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateTransactionForm(values, categories, today);
    if (result.ok) {
      onSubmit(result.value);
      return;
    }
    setErrors(result.errors);
    focusFirstInvalid(result.errors);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
      <FieldGroup>
        <Field>
          <FieldLabel id={`${formId}-type`}>Type</FieldLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={values.type}
            onValueChange={(next) => next && changeType(next as TransactionType)}
            aria-labelledby={`${formId}-type`}
            className="w-full"
          >
            <ToggleGroupItem value="expense" className="flex-1">
              Expense
            </ToggleGroupItem>
            <ToggleGroupItem value="income" className="flex-1">
              Income
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>

        <Field data-invalid={Boolean(errors.amount)}>
          <FieldLabel htmlFor={`${formId}-amount`}>Amount</FieldLabel>
          <InputGroup>
            <InputGroupAddon>{currencySymbol}</InputGroupAddon>
            <InputGroupInput
              id={`${formId}-amount`}
              data-field="amount"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={values.amount}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={`${formId}-amount-help`}
              onChange={(event) => update("amount", event.target.value)}
            />
          </InputGroup>
          {errors.amount ? (
            <FieldError id={`${formId}-amount-help`}>{errors.amount}</FieldError>
          ) : (
            <FieldDescription id={`${formId}-amount-help`}>{text.amountHint}</FieldDescription>
          )}
        </Field>

        <Field data-invalid={Boolean(errors.categoryId)}>
          <FieldLabel htmlFor={`${formId}-category`}>Category</FieldLabel>
          <Select value={values.categoryId} onValueChange={(next) => update("categoryId", next)}>
            <SelectTrigger
              id={`${formId}-category`}
              data-field="categoryId"
              className="w-full"
              aria-invalid={Boolean(errors.categoryId)}
            >
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {typeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.categoryId && <FieldError>{errors.categoryId}</FieldError>}
        </Field>

        <Field data-invalid={Boolean(errors.date)}>
          <FieldLabel htmlFor={`${formId}-date`}>Date</FieldLabel>
          <Input
            id={`${formId}-date`}
            data-field="date"
            type="date"
            max={today}
            value={values.date}
            aria-invalid={Boolean(errors.date)}
            onChange={(event) => update("date", event.target.value)}
          />
          {errors.date && <FieldError>{errors.date}</FieldError>}
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
          <Textarea
            id={`${formId}-description`}
            data-field="description"
            rows={3}
            maxLength={DESCRIPTION_MAX_LENGTH + 20}
            placeholder={text.descriptionPlaceholder}
            value={values.description}
            aria-invalid={Boolean(errors.description)}
            onChange={(event) => update("description", event.target.value)}
          />
          {errors.description ? (
            <FieldError>{errors.description}</FieldError>
          ) : (
            <FieldDescription>
              {values.description.trim().length}/{DESCRIPTION_MAX_LENGTH} characters
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === "add" ? `Add ${text.submit}` : "Save changes"}</Button>
      </div>
    </form>
  );
}
