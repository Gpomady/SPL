// compliance.ts

export interface ComplianceObligation {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
}

export interface Company {
    id: string;
    name: string;
    address: string;
    contactEmail: string;
    complianceObligations: ComplianceObligation[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    companyId: string;
}

export interface NotificationPreference {
    userId: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    preferredContactMethod: 'email' | 'sms';
}

export interface ScraperConfig {
    id: string;
    targetUrl: string;
    schedule: string; // e.g., 'daily', 'weekly'
    lastRun: string; // ISO date string of the last run
    isActive: boolean;
}

// Related Types
export type ComplianceStatus = 'pending' | 'completed' | 'overdue';
