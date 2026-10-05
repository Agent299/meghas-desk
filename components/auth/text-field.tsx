import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/** A labelled input with its inline error, wired up for screen readers. */
export function TextField({
  id,
  label,
  error,
  description,
  labelAction,
  ...inputProps
}: Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  description?: React.ReactNode;
  /** Shown at the end of the label row, e.g. a "Forgot your password?" link. */
  labelAction?: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  // The description is hidden while an error shows, so only reference what renders.
  const describedBy = [error && errorId, description && !error && descriptionId].filter(Boolean).join(" ");

  return (
    <Field data-invalid={error ? true : undefined}>
      {labelAction ? (
        <div className="flex items-center">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="ml-auto text-foreground">{labelAction}</div>
        </div>
      ) : (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        {...inputProps}
      />
      {description && !error && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
