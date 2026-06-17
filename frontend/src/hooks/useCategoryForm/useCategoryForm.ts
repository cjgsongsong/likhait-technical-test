/**
 * Custom hook for managing category form state and validation
 */

import { useState } from "react";
import type { AvailableCategory, CategoryFormData } from "../../types";

interface UseCategoryFormProps {
  availableCategories: AvailableCategory[];
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function useCategoryForm({
  availableCategories,
  initialData,
  onSubmit,
}: UseCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};
    const trimmedName = formData?.name?.trim();
    const NAME_PATTERN = /^[A-Z][A-Za-z0-9 ]*$/;

    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (!NAME_PATTERN.test(formData?.name)) {
      newErrors.name =
        "Name must start with an uppercase letter followed by zero to many alphanumeric characters and spaces";
    } else if (
      availableCategories
        ?.map((availableCategory) => availableCategory.name)
        ?.includes(trimmedName)
    ) {
      newErrors.name = "Category already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: initialData?.name || "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
