// Common Zod schemas for validation

import { z } from 'zod';

// Base entity schema
export const baseEntitySchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Common field schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const urlSchema = z.string().url('Invalid URL');
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number');

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Search schema
export const searchSchema = z.object({
  q: z.string().optional(),
  filters: z.record(z.string()).optional(),
});

// File upload schema
export const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string().url(),
});

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Contact schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  message: z.string().min(1, 'Message is required'),
});

// User profile schema
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  website: urlSchema.optional(),
  location: z.string().optional(),
});

// API response schema
export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  });

// Paginated response schema
export const paginatedResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

// Date range schema
export const dateRangeSchema = z.object({
  from: z.date(),
  to: z.date(),
});

// Currency schema
export const currencySchema = z.object({
  amount: z.number().min(0),
  currency: z.string().length(3),
});