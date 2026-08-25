export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
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
          completed_at: string | null;
          created_at: string;
          id: number;
          is_featured: boolean;
          is_published: boolean;
          logo_url: string | null;
          name: string;
          portfolio_image_url: string | null;
          project_url: string | null;
          slug: string;
          sort_order: number;
          summary: string | null;
          type: string;
          updated_at: string;
        };
        Insert: {
          alt_text?: string | null;
          build_platform?: string;
          completed_at?: string | null;
          created_at?: string;
          id?: never;
          is_featured?: boolean;
          is_published?: boolean;
          logo_url?: string | null;
          name: string;
          portfolio_image_url?: string | null;
          project_url?: string | null;
          slug: string;
          sort_order?: number;
          summary?: string | null;
          type: string;
          updated_at?: string;
        };
        Update: {
          alt_text?: string | null;
          build_platform?: string;
          completed_at?: string | null;
          created_at?: string;
          id?: never;
          is_featured?: boolean;
          is_published?: boolean;
          logo_url?: string | null;
          name?: string;
          portfolio_image_url?: string | null;
          project_url?: string | null;
          slug?: string;
          sort_order?: number;
          summary?: string | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Project = Database['public']['Tables']['projects']['Row'];
export type PricingPlan = Database['public']['Tables']['pricing_plans']['Row'];
