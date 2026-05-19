
CREATE OR REPLACE FUNCTION public.admin_operation(
  p_admin_id uuid,
  p_operation text,
  p_table_name text,
  p_data jsonb,
  p_where_clause jsonb DEFAULT NULL::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_result JSONB;
  v_id uuid;
  v_allowed_tables text[] := ARRAY[
    'team_members','about_us','awards','blog_posts','blog_comments','blog_likes',
    'careers','inquiries','job_applications','newsletter_subscriptions','settings',
    'testimonials','services','homepage_ads','banner_slides','flights_nepal',
    'prabas_holidays','prabas_australia','prabas_uae','pages','page_seo',
    'global_seo','blog_seo'
  ];
BEGIN
  -- Validate admin session
  IF NOT validate_admin_session(p_admin_id) THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin session';
  END IF;

  -- Whitelist tables
  IF NOT (p_table_name = ANY(v_allowed_tables)) THEN
    RAISE EXCEPTION 'Table % is not allowed for admin_operation', p_table_name;
  END IF;

  -- Set admin context for RLS policies
  PERFORM set_config('app.admin_validated', 'true', true);

  CASE p_operation
    WHEN 'INSERT' THEN
      EXECUTE format(
        'INSERT INTO %I SELECT * FROM jsonb_populate_record(null::%I, $1) RETURNING to_jsonb(%I.*)',
        p_table_name, p_table_name, p_table_name
      ) INTO v_result USING (p_data - 'id');

    WHEN 'UPSERT' THEN
      IF (p_data ? 'id') AND NULLIF(p_data->>'id','') IS NOT NULL THEN
        v_id := (p_data->>'id')::uuid;
        EXECUTE format(
          'UPDATE %I SET (%s) = (SELECT %s FROM jsonb_populate_record(null::%I, $1)) WHERE id = $2 RETURNING to_jsonb(%I.*)',
          p_table_name,
          (SELECT string_agg(quote_ident(key), ',') FROM jsonb_object_keys(p_data - 'id') key),
          (SELECT string_agg(quote_ident(key), ',') FROM jsonb_object_keys(p_data - 'id') key),
          p_table_name, p_table_name
        ) INTO v_result USING (p_data - 'id'), v_id;
        IF v_result IS NULL THEN
          EXECUTE format(
            'INSERT INTO %I SELECT * FROM jsonb_populate_record(null::%I, $1) RETURNING to_jsonb(%I.*)',
            p_table_name, p_table_name, p_table_name
          ) INTO v_result USING p_data;
        END IF;
      ELSE
        EXECUTE format(
          'INSERT INTO %I SELECT * FROM jsonb_populate_record(null::%I, $1) RETURNING to_jsonb(%I.*)',
          p_table_name, p_table_name, p_table_name
        ) INTO v_result USING (p_data - 'id');
      END IF;

    WHEN 'UPDATE' THEN
      IF p_where_clause IS NULL OR p_where_clause->>'id' IS NULL THEN
        RAISE EXCEPTION 'UPDATE requires id in where_clause';
      END IF;
      v_id := (p_where_clause->>'id')::uuid;
      EXECUTE format(
        'UPDATE %I SET (%s) = (SELECT %s FROM jsonb_populate_record(null::%I, $1)) WHERE id = $2 RETURNING to_jsonb(%I.*)',
        p_table_name,
        (SELECT string_agg(quote_ident(key), ',') FROM jsonb_object_keys(p_data - 'id') key),
        (SELECT string_agg(quote_ident(key), ',') FROM jsonb_object_keys(p_data - 'id') key),
        p_table_name, p_table_name
      ) INTO v_result USING (p_data - 'id'), v_id;

    WHEN 'DELETE' THEN
      IF p_where_clause IS NULL OR p_where_clause->>'id' IS NULL THEN
        RAISE EXCEPTION 'DELETE requires id in where_clause';
      END IF;
      EXECUTE format(
        'DELETE FROM %I WHERE id = $1 RETURNING to_jsonb(%I.*)',
        p_table_name, p_table_name
      ) INTO v_result USING (p_where_clause->>'id')::uuid;

    ELSE
      RAISE EXCEPTION 'Invalid operation: %', p_operation;
  END CASE;

  PERFORM set_config('app.admin_validated', 'false', true);
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$function$;
