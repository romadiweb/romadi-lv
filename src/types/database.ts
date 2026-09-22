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
          table_name:
            | 'projects'
            | 'pricing_plans'
            | 'reviews'
            | 'portal_leads'
            | 'portal_text_templates'
            | 'portal_pricing_items'
            | 'portal_quota_targets'
            | 'portal_tasks';
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
          table_name:
            | 'projects'
            | 'pricing_plans'
            | 'reviews'
            | 'portal_leads'
            | 'portal_text_templates'
            | 'portal_pricing_items'
            | 'portal_quota_targets'
            | 'portal_tasks';
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
          table_name?:
            | 'projects'
            | 'pricing_plans'
            | 'reviews'
            | 'portal_leads'
            | 'portal_text_templates'
            | 'portal_pricing_items'
            | 'portal_quota_targets'
            | 'portal_tasks';
        };
        Relationships: [];
      };
      portal_leads: {
        Row: {
          company_name: string;
          contact_channel:
            'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'email' | 'phone' | 'other';
          contacted_at: string | null;
          created_at: string;
          follow_up_due_at: string | null;
          follow_up_enabled: boolean;
          found_on: string;
          has_website: boolean;
          id: number;
          industry: string | null;
          notes: string | null;
          outreach_owner: string | null;
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
            'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'email' | 'phone' | 'other';
          contacted_at?: string | null;
          created_at?: string;
          follow_up_due_at?: never;
          follow_up_enabled?: boolean;
          found_on: string;
          has_website?: boolean;
          id?: never;
          industry?: string | null;
          notes?: string | null;
          outreach_owner?: string | null;
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
            'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'email' | 'phone' | 'other';
          contacted_at?: string | null;
          created_at?: string;
          follow_up_due_at?: never;
          follow_up_enabled?: boolean;
          found_on?: string;
          has_website?: boolean;
          id?: never;
          industry?: string | null;
          notes?: string | null;
          outreach_owner?: string | null;
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
      portal_pricing_items: {
        Row: {
          category: 'base' | 'page' | 'integration' | 'addon' | 'hourly' | 'adjustment';
          created_at: string;
          default_quantity: number;
          description: string | null;
          id: number;
          is_active: boolean;
          item_key: string;
          name: string;
          price_eur: number;
          sort_order: number;
          unit: 'project' | 'page' | 'item' | 'hour';
          updated_at: string;
        };
        Insert: {
          category: 'base' | 'page' | 'integration' | 'addon' | 'hourly' | 'adjustment';
          created_at?: string;
          default_quantity?: number;
          description?: string | null;
          id?: never;
          is_active?: boolean;
          item_key: string;
          name: string;
          price_eur: number;
          sort_order?: number;
          unit: 'project' | 'page' | 'item' | 'hour';
          updated_at?: string;
        };
        Update: {
          category?: 'base' | 'page' | 'integration' | 'addon' | 'hourly' | 'adjustment';
          created_at?: string;
          default_quantity?: number;
          description?: string | null;
          id?: never;
          is_active?: boolean;
          item_key?: string;
          name?: string;
          price_eur?: number;
          sort_order?: number;
          unit?: 'project' | 'page' | 'item' | 'hour';
          updated_at?: string;
        };
        Relationships: [];
      };
      portal_quota_targets: {
        Row: {
          created_at: string;
          id: number;
          is_active: boolean;
          label: string;
          metric_key: string;
          module: string;
          sort_order: number;
          target_value: number;
          updated_at: string;
          week_start: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          is_active?: boolean;
          label: string;
          metric_key: string;
          module: string;
          sort_order?: number;
          target_value: number;
          updated_at?: string;
          week_start: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          is_active?: boolean;
          label?: string;
          metric_key?: string;
          module?: string;
          sort_order?: number;
          target_value?: number;
          updated_at?: string;
          week_start?: string;
        };
        Relationships: [];
      };
      portal_tasks: {
        Row: {
          assigned_to: string | null;
          completed_at: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          due_date: string | null;
          id: number;
          priority: 'low' | 'normal' | 'high' | 'max' | 'critical';
          source_module: string | null;
          source_record_id: number | null;
          status: 'todo' | 'in_progress' | 'done' | 'blocked' | 'cant_do';
          task_type: 'manual' | 'new_client' | 'bug' | 'lead_followup' | 'quota';
          title: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: never;
          priority?: 'low' | 'normal' | 'high' | 'max' | 'critical';
          source_module?: string | null;
          source_record_id?: number | null;
          status?: 'todo' | 'in_progress' | 'done' | 'blocked' | 'cant_do';
          task_type?: 'manual' | 'new_client' | 'bug' | 'lead_followup' | 'quota';
          title: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: never;
          priority?: 'low' | 'normal' | 'high' | 'max' | 'critical';
          source_module?: string | null;
          source_record_id?: number | null;
          status?: 'todo' | 'in_progress' | 'done' | 'blocked' | 'cant_do';
          task_type?: 'manual' | 'new_client' | 'bug' | 'lead_followup' | 'quota';
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portal_text_templates: {
        Row: {
          category: string;
          created_at: string;
          id: number;
          notes: string | null;
          title: string;
          updated_at: string;
          variants: Json;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: never;
          notes?: string | null;
          title: string;
          updated_at?: string;
          variants: Json;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: never;
          notes?: string | null;
          title?: string;
          updated_at?: string;
          variants?: Json;
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
export type PortalPricingItem = Database['public']['Tables']['portal_pricing_items']['Row'];
export type PortalQuotaTarget = Database['public']['Tables']['portal_quota_targets']['Row'];
export type PortalTask = Database['public']['Tables']['portal_tasks']['Row'];
export type PortalTextTemplateRow = Database['public']['Tables']['portal_text_templates']['Row'];
