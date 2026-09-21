export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
      cms_audit_log: {
        Row: {
          actor_id: string | null;
          actor_role: string | null;
          changed_at: string;
          id: number;
          new_data: Json | null;
          old_data: Json | null;
          operation: 'INSERT' | 'UPDATE' | 'DELETE';
          record_id: number | null;
          table_name: 'projects' | 'pricing_plans' | 'reviews' | 'portal_leads';
        };
        Insert: {
          actor_id?: string | null;
          actor_role?: string | null;
          changed_at?: string;
          id?: never;
          new_data?: Json | null;
          old_data?: Json | null;
          operation: 'INSERT' | 'UPDATE' | 'DELETE';
          record_id?: number | null;
          table_name: 'projects' | 'pricing_plans' | 'reviews' | 'portal_leads';
        };
        Update: {
          actor_id?: string | null;
          actor_role?: string | null;
          changed_at?: string;
          id?: never;
          new_data?: Json | null;
          old_data?: Json | null;
          operation?: 'INSERT' | 'UPDATE' | 'DELETE';
          record_id?: number | null;
          table_name?: 'projects' | 'pricing_plans' | 'reviews' | 'portal_leads';
        };
        Relationships: [];
      };
      portal_leads: {
        Row: {
          company_name: string;
          contact_channel:
            | 'instagram'
            | 'facebook'
            | 'linkedin'
            | 'tiktok'
            | 'email'
            | 'phone'
            | 'other';
          contacted_at: string | null;
          created_at: string;
          follow_up_due_at: string | null;
          follow_up_enabled: boolean;
          found_on: string;
          has_website: boolean;
          id: number;
          industry: string | null;
          notes: string | null;
          outreach_owner: string;
          status:
            | 'not_contacted'
            | 'contacted'
            | 'answered'
            | 'interested'
            | 'offer_sent'
            | 'negotiation'
            | 'client'
            | 'rejected'
            | 'no_response'
            | 'deferred';
          updated_at: string;
        };
        Insert: {
          company_name: string;
          contact_channel?:
            | 'instagram'
            | 'facebook'
            | 'linkedin'
            | 'tiktok'
            | 'email'
            | 'phone'
            | 'other';
          contacted_at?: string | null;
          created_at?: string;
          follow_up_due_at?: never;
          follow_up_enabled?: boolean;
          found_on: string;
          has_website?: boolean;
          id?: never;
          industry?: string | null;
          notes?: string | null;
          outreach_owner: string;
          status?:
            | 'not_contacted'
            | 'contacted'
            | 'answered'
            | 'interested'
            | 'offer_sent'
            | 'negotiation'
            | 'client'
            | 'rejected'
            | 'no_response'
            | 'deferred';
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          contact_channel?:
            | 'instagram'
            | 'facebook'
            | 'linkedin'
            | 'tiktok'
            | 'email'
            | 'phone'
            | 'other';
          contacted_at?: string | null;
          created_at?: string;
          follow_up_due_at?: never;
          follow_up_enabled?: boolean;
          found_on?: string;
          has_website?: boolean;
          id?: never;
          industry?: string | null;
          notes?: string | null;
          outreach_owner?: string;
          status?:
            | 'not_contacted'
            | 'contacted'
            | 'answered'
            | 'interested'
            | 'offer_sent'
            | 'negotiation'
            | 'client'
            | 'rejected'
            | 'no_response'
            | 'deferred';
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          client_name: string;
          client_url: string | null;
          created_at: string;
          id: number;
          is_published: boolean;
          logo_url: string | null;
          quote: string | null;
          rating: number | null;
          reviewer_name: string | null;
          reviewer_role: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          client_name: string;
          client_url?: string | null;
          created_at?: string;
          id?: never;
          is_published?: boolean;
          logo_url?: string | null;
          quote?: string | null;
          rating?: number | null;
          reviewer_name?: string | null;
          reviewer_role?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          client_name?: string;
          client_url?: string | null;
          created_at?: string;
          id?: never;
          is_published?: boolean;
          logo_url?: string | null;
          quote?: string | null;
          rating?: number | null;
          reviewer_name?: string | null;
          reviewer_role?: string | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          created_at: string;
          cta_href: string | null;
          cta_label: string;
          description: string;
          features: string[];
          id: number;
          is_featured: boolean;
          is_published: boolean;
          name: string;
          price_label: string;
          price_prefix: string;
          service_key: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          cta_href?: string | null;
          cta_label: string;
          description: string;
          features?: string[];
          id?: never;
          is_featured?: boolean;
          is_published?: boolean;
          name: string;
          price_label: string;
          price_prefix?: string;
          service_key: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          cta_href?: string | null;
          cta_label?: string;
          description?: string;
          features?: string[];
          id?: never;
          is_featured?: boolean;
          is_published?: boolean;
          name?: string;
          price_label?: string;
          price_prefix?: string;
          service_key?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          alt_text: string | null;
          build_platform: string;
          challenge: string | null;
          completed_at: string | null;
          created_at: string;
          id: number;
          is_featured: boolean;
          is_published: boolean;
          features: string[];
          integrations: string[];
          logo_url: string | null;
          name: string;
          portfolio_image_url: string | null;
          project_url: string | null;
          slug: string;
          sort_order: number;
          summary: string | null;
          solution: string | null;
          technologies: string[];
          type: string;
          updated_at: string;
        };
        Insert: {
          alt_text?: string | null;
          build_platform?: string;
          challenge?: string | null;
          completed_at?: string | null;
          created_at?: string;
          id?: never;
          is_featured?: boolean;
          is_published?: boolean;
          features?: string[];
          integrations?: string[];
          logo_url?: string | null;
          name: string;
          portfolio_image_url?: string | null;
          project_url?: string | null;
          slug: string;
          sort_order?: number;
          summary?: string | null;
          solution?: string | null;
          technologies?: string[];
          type: string;
          updated_at?: string;
        };
        Update: {
          alt_text?: string | null;
          build_platform?: string;
          challenge?: string | null;
          completed_at?: string | null;
          created_at?: string;
          id?: never;
          is_featured?: boolean;
          is_published?: boolean;
          features?: string[];
          integrations?: string[];
          logo_url?: string | null;
          name?: string;
          portfolio_image_url?: string | null;
          project_url?: string | null;
          slug?: string;
          sort_order?: number;
          summary?: string | null;
          solution?: string | null;
          technologies?: string[];
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      consume_portal_login_attempt: {
        Args: {
          p_block_seconds?: number;
          p_max_attempts?: number;
          p_rate_key: string;
          p_window_seconds?: number;
        };
        Returns: { allowed: boolean; retry_after_seconds: number }[];
      };
      reset_portal_login_attempts: {
        Args: { p_rate_key: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Project = Database['public']['Tables']['projects']['Row'];
export type PricingPlan = Database['public']['Tables']['pricing_plans']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type CmsAuditLog = Database['public']['Tables']['cms_audit_log']['Row'];
export type PortalLead = Database['public']['Tables']['portal_leads']['Row'];
