export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adiantamentos: {
        Row: {
          created_at: string
          data: string
          id: string
          imovel_id: string | null
          investidor_id: string
          is_sa7d: boolean
          mes_competencia: string
          observacoes: string | null
          origem: Database["public"]["Enums"]["origem_adiantamento"]
          recebedor: string | null
          valor: number
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
          imovel_id?: string | null
          investidor_id: string
          is_sa7d?: boolean
          mes_competencia: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_adiantamento"]
          recebedor?: string | null
          valor: number
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          imovel_id?: string | null
          investidor_id?: string
          is_sa7d?: boolean
          mes_competencia?: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_adiantamento"]
          recebedor?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "adiantamentos_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adiantamentos_investidor_id_fkey"
            columns: ["investidor_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_fixos: {
        Row: {
          categoria: string
          created_at: string
          descricao: string | null
          id: string
          mes_competencia: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          descricao?: string | null
          id?: string
          mes_competencia: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          id?: string
          mes_competencia?: string
          valor?: number
        }
        Relationships: []
      }
      imoveis: {
        Row: {
          capacidade: number
          codigo: string
          created_at: string
          custo_faxina: number
          custo_lavanderia: number
          endereco: string
          id: string
          investidor_id: string
          percentual_comissao: number
          status: Database["public"]["Enums"]["status_geral"]
          tipo: Database["public"]["Enums"]["tipo_imovel"]
          updated_at: string
          valor_faxina: number
          valor_lavanderia: number
        }
        Insert: {
          capacidade?: number
          codigo: string
          created_at?: string
          custo_faxina?: number
          custo_lavanderia?: number
          endereco: string
          id?: string
          investidor_id: string
          percentual_comissao?: number
          status?: Database["public"]["Enums"]["status_geral"]
          tipo?: Database["public"]["Enums"]["tipo_imovel"]
          updated_at?: string
          valor_faxina?: number
          valor_lavanderia?: number
        }
        Update: {
          capacidade?: number
          codigo?: string
          created_at?: string
          custo_faxina?: number
          custo_lavanderia?: number
          endereco?: string
          id?: string
          investidor_id?: string
          percentual_comissao?: number
          status?: Database["public"]["Enums"]["status_geral"]
          tipo?: Database["public"]["Enums"]["tipo_imovel"]
          updated_at?: string
          valor_faxina?: number
          valor_lavanderia?: number
        }
        Relationships: [
          {
            foreignKeyName: "imoveis_investidor_id_fkey"
            columns: ["investidor_id"]
            isOneToOne: false
            referencedRelation: "investidores"
            referencedColumns: ["id"]
          },
        ]
      }
      importacoes_airbnb: {
        Row: {
          arquivo: string | null
          created_at: string
          duplicados: number
          erros: number
          id: string
          inseridos: number
          tipo: string
          total_linhas: number
          user_id: string | null
        }
        Insert: {
          arquivo?: string | null
          created_at?: string
          duplicados?: number
          erros?: number
          id?: string
          inseridos?: number
          tipo: string
          total_linhas?: number
          user_id?: string | null
        }
        Update: {
          arquivo?: string | null
          created_at?: string
          duplicados?: number
          erros?: number
          id?: string
          inseridos?: number
          tipo?: string
          total_linhas?: number
          user_id?: string | null
        }
        Relationships: []
      }
      investidores: {
        Row: {
          created_at: string
          documento: string | null
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          pix: string | null
          status: Database["public"]["Enums"]["status_geral"]
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          documento?: string | null
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          pix?: string | null
          status?: Database["public"]["Enums"]["status_geral"]
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          documento?: string | null
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          pix?: string | null
          status?: Database["public"]["Enums"]["status_geral"]
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      manutencoes: {
        Row: {
          anexos: Json | null
          area: string | null
          categoria: string | null
          created_at: string
          custo: number
          data: string
          descricao: string
          id: string
          imovel_id: string
          mes_competencia: string
          parametro_id: string | null
          rateio: Database["public"]["Enums"]["rateio_manutencao"]
          status: string
          valor_cobrado: number
        }
        Insert: {
          anexos?: Json | null
          area?: string | null
          categoria?: string | null
          created_at?: string
          custo?: number
          data: string
          descricao: string
          id?: string
          imovel_id: string
          mes_competencia: string
          parametro_id?: string | null
          rateio?: Database["public"]["Enums"]["rateio_manutencao"]
          status?: string
          valor_cobrado?: number
        }
        Update: {
          anexos?: Json | null
          area?: string | null
          categoria?: string | null
          created_at?: string
          custo?: number
          data?: string
          descricao?: string
          id?: string
          imovel_id?: string
          mes_competencia?: string
          parametro_id?: string | null
          rateio?: Database["public"]["Enums"]["rateio_manutencao"]
          status?: string
          valor_cobrado?: number
        }
        Relationships: [
          {
            foreignKeyName: "manutencoes_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manutencoes_parametro_id_fkey"
            columns: ["parametro_id"]
            isOneToOne: false
            referencedRelation: "parametros_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      parametros_servico: {
        Row: {
          area: string | null
          ativo: boolean
          categoria: string | null
          created_at: string
          custo: number
          faixas_hospedes: Json | null
          id: string
          imovel_id: string | null
          nome: string
          updated_at: string
          valor_cobrado: number
        }
        Insert: {
          area?: string | null
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          custo?: number
          faixas_hospedes?: Json | null
          id?: string
          imovel_id?: string | null
          nome: string
          updated_at?: string
          valor_cobrado?: number
        }
        Update: {
          area?: string | null
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          custo?: number
          faixas_hospedes?: Json | null
          id?: string
          imovel_id?: string | null
          nome?: string
          updated_at?: string
          valor_cobrado?: number
        }
        Relationships: [
          {
            foreignKeyName: "parametros_servico_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          codigo_referencia: string | null
          created_at: string
          data: string
          id: string
          importacao_id: string | null
          is_sa7d: boolean
          recebedor: string
          valor_pago: number
        }
        Insert: {
          codigo_referencia?: string | null
          created_at?: string
          data: string
          id?: string
          importacao_id?: string | null
          is_sa7d?: boolean
          recebedor: string
          valor_pago?: number
        }
        Update: {
          codigo_referencia?: string | null
          created_at?: string
          data?: string
          id?: string
          importacao_id?: string | null
          is_sa7d?: boolean
          recebedor?: string
          valor_pago?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      reservas: {
        Row: {
          check_in: string
          check_out: string
          codigo_airbnb: string | null
          created_at: string
          hospedes: number
          id: string
          imovel_id: string
          importacao_id: string | null
          mes_competencia: string
          taxas_airbnb: number
          updated_at: string
          valor_bruto: number
          valor_liquido: number
        }
        Insert: {
          check_in: string
          check_out: string
          codigo_airbnb?: string | null
          created_at?: string
          hospedes?: number
          id?: string
          imovel_id: string
          importacao_id?: string | null
          mes_competencia: string
          taxas_airbnb?: number
          updated_at?: string
          valor_bruto?: number
          valor_liquido?: number
        }
        Update: {
          check_in?: string
          check_out?: string
          codigo_airbnb?: string | null
          created_at?: string
          hospedes?: number
          id?: string
          imovel_id?: string
          importacao_id?: string | null
          mes_competencia?: string
          taxas_airbnb?: number
          updated_at?: string
          valor_bruto?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos_operacionais: {
        Row: {
          anexos: Json | null
          area: string | null
          created_at: string
          custo_real: number
          data: string
          id: string
          imovel_id: string
          mes_competencia: string
          observacoes: string | null
          parametro_id: string | null
          prestador: string | null
          reserva_id: string | null
          tipo: Database["public"]["Enums"]["tipo_servico_op"]
          valor_cobrado: number
        }
        Insert: {
          anexos?: Json | null
          area?: string | null
          created_at?: string
          custo_real?: number
          data: string
          id?: string
          imovel_id: string
          mes_competencia: string
          observacoes?: string | null
          parametro_id?: string | null
          prestador?: string | null
          reserva_id?: string | null
          tipo: Database["public"]["Enums"]["tipo_servico_op"]
          valor_cobrado?: number
        }
        Update: {
          anexos?: Json | null
          area?: string | null
          created_at?: string
          custo_real?: number
          data?: string
          id?: string
          imovel_id?: string
          mes_competencia?: string
          observacoes?: string | null
          parametro_id?: string | null
          prestador?: string | null
          reserva_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_servico_op"]
          valor_cobrado?: number
        }
        Relationships: [
          {
            foreignKeyName: "servicos_operacionais_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_operacionais_parametro_id_fkey"
            columns: ["parametro_id"]
            isOneToOne: false
            referencedRelation: "parametros_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_operacionais_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _reimport_airbnb: {
        Args: { p_adt: Json; p_res: Json }
        Returns: {
          adt_atualizados: number
          adt_inseridos: number
          reservas_atualizadas: number
          reservas_inseridas: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "operacional" | "investidor"
      origem_adiantamento: "airbnb_direto" | "empresa_repasse"
      rateio_manutencao: "investidor" | "empresa"
      status_geral: "ativo" | "inativo" | "manutencao"
      tipo_imovel: "studio" | "1Q" | "2Q" | "3Q" | "cobertura"
      tipo_servico_op: "faxina" | "lavanderia" | "material" | "manutencao"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operacional", "investidor"],
      origem_adiantamento: ["airbnb_direto", "empresa_repasse"],
      rateio_manutencao: ["investidor", "empresa"],
      status_geral: ["ativo", "inativo", "manutencao"],
      tipo_imovel: ["studio", "1Q", "2Q", "3Q", "cobertura"],
      tipo_servico_op: ["faxina", "lavanderia", "material", "manutencao"],
    },
  },
} as const
