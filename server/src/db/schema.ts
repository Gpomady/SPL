import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const globalRoleEnum = pgEnum('global_role', ['MASTER', 'PLATFORM_SUPPORT', 'USER']);
export const companyRoleEnum = pgEnum('company_role', ['ADMIN', 'MANAGER', 'COLLABORATOR', 'VIEWER']);
export const membershipStatusEnum = pgEnum('membership_status', ['pending', 'active', 'suspended']);
export const companyStatusEnum = pgEnum('company_status', ['pending_setup', 'active', 'suspended', 'cancelled']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  globalRole: globalRoleEnum('global_role').notNull().default('USER'),
  avatar: text('avatar'),
  isActive: boolean('is_active').notNull().default(true),
  mustChangePassword: boolean('must_change_password').notNull().default(false),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  cnpj: varchar('cnpj', { length: 18 }).notNull().unique(),
  razaoSocial: varchar('razao_social', { length: 255 }).notNull(),
  nomeFantasia: varchar('nome_fantasia', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  state: varchar('state', { length: 2 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address'),
  cnaePrincipal: varchar('cnae_principal', { length: 10 }).notNull(),
  cnaesSecundarios: jsonb('cnaes_secundarios').$type<string[]>().default([]),
  riskLevel: varchar('risk_level', { length: 20 }).default('medium'),
  status: companyStatusEnum('status').notNull().default('pending_setup'),
  contractStartDate: timestamp('contract_start_date'),
  contractEndDate: timestamp('contract_end_date'),
  slaTier: varchar('sla_tier', { length: 50 }).default('standard'),
  billingEmail: varchar('billing_email', { length: 255 }),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const companyMemberships = pgTable('company_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyRole: companyRoleEnum('company_role').notNull().default('COLLABORATOR'),
  status: membershipStatusEnum('status').notNull().default('pending'),
  invitedBy: uuid('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  companyRole: companyRoleEnum('company_role').notNull().default('COLLABORATOR'),
  token: varchar('token', { length: 255 }).notNull().unique(),
  invitedBy: uuid('invited_by').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const legalObligations = pgTable('legal_obligations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  subcategory: varchar('subcategory', { length: 100 }),
  agency: varchar('agency', { length: 100 }).notNull(),
  frequency: varchar('frequency', { length: 50 }),
  deadline: timestamp('deadline'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  applicability: varchar('applicability', { length: 20 }).default('to_evaluate'),
  riskLevel: varchar('risk_level', { length: 20 }).default('medium'),
  responsible: varchar('responsible', { length: 255 }),
  priority: varchar('priority', { length: 20 }).default('medium'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const legalRequirements = pgTable('legal_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  lawReference: varchar('law_reference', { length: 255 }),
  agency: varchar('agency', { length: 100 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  applicableCnaes: jsonb('applicable_cnaes').$type<string[]>().default([]),
  applicableStates: jsonb('applicable_states').$type<string[]>().default([]),
  riskLevel: varchar('risk_level', { length: 20 }).default('medium'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  obligationId: uuid('obligation_id').references(() => legalObligations.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  category: varchar('category', { length: 100 }),
  fileUrl: text('file_url'),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  status: varchar('status', { length: 50 }).default('pending'),
  expiresAt: timestamp('expires_at'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const actionPlans = pgTable('action_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  obligationId: uuid('obligation_id').references(() => legalObligations.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  responsible: varchar('responsible', { length: 255 }),
  dueDate: timestamp('due_date'),
  status: varchar('status', { length: 50 }).default('pending'),
  priority: varchar('priority', { length: 20 }).default('medium'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const questionnaires = pgTable('questionnaires', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  questions: jsonb('questions').$type<any[]>().default([]),
  status: varchar('status', { length: 50 }).default('draft'),
  isTemplate: boolean('is_template').notNull().default(false),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const questionnaireResponses = pgTable('questionnaire_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionnaireId: uuid('questionnaire_id').notNull().references(() => questionnaires.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  respondentId: uuid('respondent_id').references(() => users.id),
  answers: jsonb('answers').$type<Record<string, any>>().default({}),
  status: varchar('status', { length: 50 }).default('pending'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info'),
  isRead: boolean('is_read').notNull().default(false),
  link: text('link'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  companyId: uuid('company_id').references(() => companies.id),
  action: varchar('action', { length: 100 }).notNull(),
  entity: varchar('entity', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  changes: jsonb('changes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(companyMemberships),
  refreshTokens: many(refreshTokens),
  notifications: many(notifications),
  sentInvitations: many(invitations),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  memberships: many(companyMemberships),
  obligations: many(legalObligations),
  documents: many(documents),
  actionPlans: many(actionPlans),
  questionnaires: many(questionnaires),
  notifications: many(notifications),
  creator: one(users, { fields: [companies.createdBy], references: [users.id] }),
}));

export const companyMembershipsRelations = relations(companyMemberships, ({ one }) => ({
  company: one(companies, { fields: [companyMemberships.companyId], references: [companies.id] }),
  user: one(users, { fields: [companyMemberships.userId], references: [users.id] }),
  inviter: one(users, { fields: [companyMemberships.invitedBy], references: [users.id] }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  company: one(companies, { fields: [invitations.companyId], references: [companies.id] }),
  inviter: one(users, { fields: [invitations.invitedBy], references: [users.id] }),
}));

export const obligationsRelations = relations(legalObligations, ({ one, many }) => ({
  company: one(companies, { fields: [legalObligations.companyId], references: [companies.id] }),
  documents: many(documents),
  actionPlans: many(actionPlans),
}));

export const questionnairesRelations = relations(questionnaires, ({ one, many }) => ({
  company: one(companies, { fields: [questionnaires.companyId], references: [companies.id] }),
  creator: one(users, { fields: [questionnaires.createdBy], references: [users.id] }),
  responses: many(questionnaireResponses),
}));

export const questionnaireResponsesRelations = relations(questionnaireResponses, ({ one }) => ({
  questionnaire: one(questionnaires, { fields: [questionnaireResponses.questionnaireId], references: [questionnaires.id] }),
  company: one(companies, { fields: [questionnaireResponses.companyId], references: [companies.id] }),
  respondent: one(users, { fields: [questionnaireResponses.respondentId], references: [users.id] }),
}));
